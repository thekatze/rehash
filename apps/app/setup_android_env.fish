echo "Setting up environment variables for Tauri Android Development on Mac"

export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 --color=never $ANDROID_HOME/ndk)"
