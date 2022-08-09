package main

import (
	"os"
	"fmt"
	"path"
	"context"
	"io/ioutil"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadConfig() (string, error) {
	homeDir, _ := os.UserHomeDir()
	fileData, err := os.ReadFile(fmt.Sprint(homeDir, "/lilith/store.json"))
	if err != nil {
		return "", err
	}
	return string(fileData), err
}

func (a *App) SaveConfig(config string) error {
	homeDir, err  := os.UserHomeDir()
	if err != nil {
		return err
	}
	filename := path.Join(homeDir, "/lilith/store.json")
	return ioutil.WriteFile(filename, []byte(config), 0600)
}