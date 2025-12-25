mod settings;
use settings::Settings;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
fn open_dir(app: AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(&path, None::<&str>)
        .map_err(|e| e.to_string())
}

fn settings_path(app: AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("Failed to get app data directory")
        .join("settings.json")
}

#[tauri::command]
fn get_settings(app: AppHandle) -> Result<Settings, String> {
    let path: PathBuf = settings_path(app);
    if !path.exists() {
        let settings: Settings = Settings::new();
        settings.save(&path).map_err(|e| e.to_string())?;
        return Ok(settings);
    }
    let settings: Settings = Settings::load(&path).map_err(|e| e.to_string())?;
    Ok(settings)
}

#[tauri::command]
fn save_settings(app: AppHandle, settings: Settings) -> Result<Settings, String> {
    let path: PathBuf = settings_path(app);
    settings.save(&path).map_err(|e| e.to_string())?;
    Ok(settings)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let path: PathBuf = app
                .handle()
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");
            std::fs::create_dir_all(path).expect("Failed to create app data directory");
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_dir,
            get_settings,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
