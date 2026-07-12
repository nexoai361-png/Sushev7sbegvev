package com.reversx.ide;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KeyboardModifier")
public class KeyboardModifierPlugin extends Plugin {

    @PluginMethod
    public void setModifiers(PluginCall call) {
        boolean ctrl = call.getBoolean("ctrl", false);
        boolean shift = call.getBoolean("shift", false);
        boolean alt = call.getBoolean("alt", false);
        
        MainActivity.isCtrlActive = ctrl;
        MainActivity.isShiftActive = shift;
        MainActivity.isAltActive = alt;
        
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}
