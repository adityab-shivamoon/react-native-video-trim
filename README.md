 ## Project Creation
- Used this blog [Starting React Native Project in 2023](https://dev.to/vladimirvovk/starting-react-native-project-in-2023-2le)
<br>
- Using [Expo 49](https://blog.expo.dev/expo-sdk-49-c6d398cdf740).
<br>
1. Run `npx create-expo-app -t expo-ts` command.
2. Type your project name.
3. Change directory to your project with `cd <your-project-name>` command.
4. Run `npm start android` to start the Metro Bundler.
5. Press `i` to start the iOS simulator or `a` to run the Android emulator.📱

Please use the `npx expo eject` command to switch to the "bare" react-native app. See the [docs](https://docs.expo.dev/introduction/managed-vs-bare/) to learn about the difference between managed and bare workflows.

Happy hacking! 🤓
 - npx pod-install (imp)
 cd android ./gradlew clean
## Code Features

- [TypeScript](https://www.typescriptlang.org/).
- Absolute path imports (e.g. `import { ComponentA } from 'src/components/A'`).
- [Prettier](https://prettier.io/).
- Automaticaly sort imports on save.
- Check code for errors with [TypeScript compiler](https://www.typescriptlang.org/tsconfig#noEmit) and [ESLint](https://eslint.org/).
- Generate changelog with [standard-version](https://github.com/conventional-changelog/standard-version).
- Lint commits with [Husky](https://github.com/typicode/husky).
- [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/).
- Write tests with [Jest](https://jestjs.io/) and [React Native Testing Library](https://testing-library.com/).


