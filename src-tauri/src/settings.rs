use serde::{Deserialize, Serialize};
use std::fs::File;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub enum Theme {
    Light,
    Dark,
    System,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    pub color_theme: Theme,
}

impl Settings {
    pub fn new() -> Self {
        Self {
            color_theme: Theme::System,
        }
    }

    pub fn save(&self, path: &Path) -> Result<(), String> {
        let file = File::create(path).map_err(|e| e.to_string())?;
        serde_json::to_writer_pretty(file, self).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn load(path: &Path) -> Result<Self, String> {
        let file = File::open(path).map_err(|e| e.to_string())?;
        let settings: Self = serde_json::from_reader(file).map_err(|e| e.to_string())?;
        Ok(settings)
    }
}
