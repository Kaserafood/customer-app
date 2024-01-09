package com.kasera.client;
import android.os.Bundle;

import com.facebook.FacebookSdk;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.zoontek.rnbootsplash.RNBootSplash;
import expo.modules.ReactActivityDelegateWrapper;
import io.branch.rnbranch.*;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ClientApp";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {

      @Override
      protected void loadApp(String appKey) {
        RNBootSplash.init(MainActivity.this); // <- initialize the splash screen
        super.loadApp(appKey);
        FacebookSdk.sdkInitialize(getApplicationContext());
      }
    };
  }

  // Override onStart:
  @Override
  protected void onStart() {
      super.onStart();
      RNBranchModule.initSession(getIntent().getData(), this);
  }
  
  // Override onNewIntent:
  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);
      RNBranchModule.onNewIntent(intent);
  }

}
