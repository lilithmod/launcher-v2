package main

import (
	"embed"
	"fmt"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/mac"

	"lilith/internal/update"
)

//go:embed frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	app := NewApp()

	if runtime.GOOS == "linux" {
		err := wails.Run(&options.App{
			Title:            "Lilith Launcher",
			Width:            1160,
			DisableResize:    false,
			Height:           646,
			Frameless:        true,
			Assets:           assets,
			BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
			OnDomReady:       app.domReady,
			OnShutdown:       app.shutdown,
			Bind: []interface{}{
				app,
			},
			Mac: &mac.Options{
				About: &mac.AboutInfo{
					Title:   fmt.Sprintf("Lilith Launcher v%v", update.Version),
					Message: "© 2022 Lilith Development",
					Icon:    icon,
				},
			},
		})
		if err != nil {
			println("Error:", err.Error())
		}
	} else {
		err := wails.Run(&options.App{
			Title:            "Lilith Launcher",
			Width:            1160,
			DisableResize:    true,
			Height:           646,
			Frameless:        true,
			Assets:           assets,
			BackgroundColour: &options.RGBA{R: 23, G: 23, B: 23, A: 1},
			OnDomReady:       app.domReady,
			OnShutdown:       app.shutdown,
			Bind: []interface{}{
				app,
			},
			Mac: &mac.Options{
				About: &mac.AboutInfo{
					Title:   fmt.Sprintf("Lilith Launcher v%v", update.Version),
					Message: "© 2022 Lilith Development",
					Icon:    icon,
				},
			},
		})
		if err != nil {
			println("Error:", err.Error())
		}
	}
}
