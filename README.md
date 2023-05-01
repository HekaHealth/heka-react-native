# heka-react-native

heka health plugin for react native

## Installation

#### npm

```sh
npm install --save @heka-health/heka-react-native react-native-app-auth @tanstack/react-query axios dayjs
```

#### yarn

```sh
yarn add @heka-health/heka-react-native react-native-app-auth @tanstack/react-query axios dayjs
```

## Setup

<!-- Please refer to the platform specific setup for `react-native-app-auth`
- [iOS](https://github.com/FormidableLabs/react-native-app-auth#ios-setup)
- [Android](https://github.com/FormidableLabs/react-native-app-auth#android-setup)
 -->

#### Google Fit

> Note: Google fit is only supported on Android devices for now.

##### 1. Google Client Id

To enable Google Fit, you need to provide the Google Client ID generated for your app. The Client ID can be set using the edit app option in the Heka dashboard or when creating a new app.

To get the Google Client ID, follow this guide at Get an OAuth 2.0 Client ID | Google Fit. It will be of the format `YOUR_CLIENT_ID.apps.googleusercontent.com`

##### 2. Redirect URI

Redirect URI needs to be set up so that the application is opened successfully post Google Auth. Make the following couple of changes to `android/app/src/main/AndroidManifest.xml` file.

In application tag, add the following:

```xml
...
  <application
    ...
    ...
    # Add the line below
    xmlns:tools="http://schemas.android.com/tools"
  >
    ....
  </application>
...
```

Now add the whole activity inside the application. Make sure this activity is not nested inside another activity.

```xml
  <activity
      android:name="net.openid.appauth.RedirectUriReceiverActivity"
      android:exported="true"
      tools:node="replace">
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
          android:scheme="com.googleusercontent.apps.<YOUR_GOOGLE_CLIENT_ID>"
        />
      </intent-filter>
  </activity>
```

There are other simpler ways to set up app redirect URLs, however, this method is recommended to support multiple redirect URLs for various platforms like Fitbit, Strava etc.

#### Apple Healthkit

> Note: This is only supported on iOS.

1. Append the `Info.plist` with the following 2 entries:

```
<key>NSHealthShareUsageDescription</key>
<string>We will sync your data with the Apple Health app to give you better insights</string>
<key>NSHealthUpdateUsageDescription</key>
<string>We will sync your data with the Apple Health app to give you better insights</string>
```

2. Enabling HealthKit requires the following two steps in `Xcode`:

- Go to the `Signing & Capabilities` tab of the Runner target's settings and add the `HealthKit` capability.
- Enable the background delivery option for `HealthKit`.

3. To make sure that health data is being synced even while on background, initialize the sync observers in `application:didFinishLaunchingWithOptions` method of `AppDelegate.swift`:

```swift
import HekaCore // Make sure you import HekaCore
// ...

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // ....
    HekaManager().installObservers()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
}
```

## Usage

```typescript
import { HekaComponent } from '@heka-health/heka-react-native';

const appKey = 'YOUR_API_KEY';
const userUUID = 'YOUR_USER_UUID';

<HekaComponent appKey={appKey} userUUID={userUUID} />;
```

The `userUuid` is a unique user identifier that you use across your app. We don't store any user personal information of your users and will link their health data to this uuid.
