```
Angular app:
/screen-shot/screen-shot

ASP.NET Core Web API:
/screen-shot/ScreenShot
```

## Server settings for testing application in mobile phone in local network

### Angular

To make angular server visible in local network for phone testing use:

```bash
npm run start-ext
```

> This command info is in [package.json](/screen-shot/package.json), line 17.

After that open browser at `https://<local ip address of your computer/>:4200`.
Example: `https://192.168.1.38:4200`.

From your phone also open phones' browser at `https://<local ip address of your computer/>:4200`.

> HTTPS is required to access camera.

### ASP.NET Core Web API

To make ASP.NET Core Web API visible in local network for phone testing, [launchSettings.json](/ScreenShot/ScreenShot/Properties/launchSettings.json) is modified to host server in `0.0.0.0`.

```json
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    ...
  },
  "profiles": {
    "IIS Express": {
        ...
    },
    "ScreenShot": {
        ...
      "applicationUrl": "https://0.0.0.0:5001;http://0.0.0.0:5000",
        ...
    }
  }
}
```

This can be used by using `dotnet run`, from the folder [ScreenShot](/ScreenShot/ScreenShot/).

To modify this to default, change:
`"applicationUrl": "https://0.0.0.0:5001;http://0.0.0.0:5000"`
to:
`"applicationUrl": "https://localhost:5001;http://localhost:5000"`

### Firewall and network settings in windows to allow local machine to be visible in local network

Network settings:
![Network settings](/screen-shot/docs/network.png)

Firewall rule:
![Firewall rule](/screen-shot/docs/firewall.png)

> Disable this firewall rule later.

## For testing in your local machine (not in phone)

### Angular

- Change `url` property in [camera.component.ts](/screen-shot/screen-shot/src/app/camera/camera.component.ts) from `url = "https://192.168.1.38:5001/"` to `url = "https://localhost:44320/"` or according to your ASP.NET web server.

- Just use the default `npm start or ng serve` and access at `https://localhost:4200`.

### ASP.NET Core Web API

- Use the default IIS profile, i.e., Just press F5 or Ctrl+F5.
