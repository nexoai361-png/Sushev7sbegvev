package com.reversx.ide;

import android.content.Context;
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
        try {
            pm.getPackageInfo("com.termux", 0);
            isInstalled = true;
        } catch (PackageManager.NameNotFoundException e) {
            isInstalled = false;
        }

        JSObject result = new JSObject();
        result.put("installed", isInstalled);
        call.resolve(result);
    }
}
