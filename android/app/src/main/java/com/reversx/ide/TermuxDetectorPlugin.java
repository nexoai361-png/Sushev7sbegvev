package com.reversx.ide;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TermuxDetector")
public class TermuxDetectorPlugin extends Plugin {

    @PluginMethod
    public void checkTermuxInstalled(PluginCall call) {
        Context context = getContext();
        PackageManager pm = context.getPackageManager();
        boolean isInstalled = false;
        
        // Method 1: Check by package info
        try {
            pm.getPackageInfo("com.termux", 0);
            isInstalled = true;
        } catch (PackageManager.NameNotFoundException e) {
            isInstalled = false;
        } catch (Exception e) {
            isInstalled = false;
        }

        // Method 2: Check by launch intent as fallback
        if (!isInstalled) {
            try {
                Intent intent = pm.getLaunchIntentForPackage("com.termux");
                if (intent != null) {
                    isInstalled = true;
                }
            } catch (Exception e) {
                // Ignore fallback exception
            }
        }

        // Method 3: Check by application info
        if (!isInstalled) {
            try {
                android.content.pm.ApplicationInfo info = pm.getApplicationInfo("com.termux", 0);
                if (info != null && info.enabled) {
                    isInstalled = true;
                }
            } catch (Exception e) {
                // Ignore fallback exception
            }
        }

        JSObject result = new JSObject();
        result.put("installed", isInstalled);
        call.resolve(result);
    }
}
