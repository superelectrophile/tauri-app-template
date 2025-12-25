# `superelectrophile`'s Tauri App Template

I've made a few Tauri apps for my personal use. This is an opinionated template that I use that provides a lot of scaffolding I've found useful, and is meant for those with some experience in web development. I've implemented basic features such as routing, styling including color theme support, basic settings, and a d3 chart.

If you want full customization, there's always [Tauri's official template](https://v2.tauri.app/start/create-project/).

## Setup

```bash
pnpm install
pnpm tauri dev
```

## Choices

### Language

`TypeScript`- needs no explanation. Even on smaller projects, I prefer the assurance of type safety. With AI tools, it becomes trivial to type your code quickly. I find that the benefits of typing far outweighs the overhead even on quite small projects.

### Package Manager

`pnpm`- symlinks avoiding duplicate dependencies. Modern package manager generally better than `npm`.

### Frontend Framework

`React` + `Vite`. Both are common frameworks for web development.

### Routing

`TanStack Router`. Common routing library for React. Note also the `vite` plugin that automatically generates routes in development mode. One might note that because tauri is meant for desktop apps, it might be overkill to use a routing library since users can't navigate to arbitrary pages. However, I've found it useful for code organization and compat with potentially deployment to the web. Also, from my past experience without using routing with Tauri apps, I often end up recreating the functionality anyway.

### Styling

`Tailwind CSS`. There's no going back to plain CSS after tailwind. Simply not having to thinking about class names is such a huge time save. Not having additional CSS files, having everything in one source file feels so much better. That said, it's not an either/or situation- I still use plain CSS for some things notably any set of styles that are repeated very frequently. However, Tailwind is effective at the 95% cases.

That said, if you're completely new to web development/ CSS, I would recommend learning plain CSS first. Tailwind is a great tool, but it's more of syntactic sugar for CSS. If you need to debug something in devtools, it will be in CSS. If you need to read MDN documentation, it will be in CSS.

### Other Dependencies

- `clsx`- for class name manipulation.
- `luxon`- for date and time manipulation. In every app I've made, I've felt the need for a better implementation of date other than the standard builtins. I enjoy the many utilities luxon provides- separate datetime and duration classes, easier timezone handling, formatting, etc. while being immutable.
- `prettier`- for code formatting. It doesn't make much of a difference which formatter you use, just that you do use one. Not having to manually format code is just a better dev experience. Makes your git diffs cleaner too.
- `vite-plugin-svgr` nice plugin for importing SVGs. While the svg's I use are from Material Icons, I've changed the fill color to `currentColor` so that it can be styled with css.
