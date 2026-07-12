package com.reversx.ide;

import android.os.Bundle;
import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public static boolean isCtrlActive = false;
    public static boolean isShiftActive = false;
    public static boolean isAltActive = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TermuxDetectorPlugin.class);
        registerPlugin(SafPlugin.class);
        registerPlugin(KeyboardModifierPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int metaState = event.getMetaState();
        boolean modified = false;

        if (isCtrlActive) {
            metaState |= KeyEvent.META_CTRL_ON | KeyEvent.META_CTRL_LEFT_ON;
            modified = true;
        }
        if (isShiftActive) {
            metaState |= KeyEvent.META_SHIFT_ON | KeyEvent.META_SHIFT_LEFT_ON;
            modified = true;
        }
        if (isAltActive) {
            metaState |= KeyEvent.META_ALT_ON | KeyEvent.META_ALT_LEFT_ON;
            modified = true;
        }

        if (modified) {
            KeyEvent newEvent = new KeyEvent(
                event.getDownTime(),
                event.getEventTime(),
                event.getAction(),
                event.getKeyCode(),
                event.getRepeatCount(),
                metaState,
                event.getDeviceId(),
                event.getScanCode(),
                event.getFlags(),
                event.getSource()
            );
            return super.dispatchKeyEvent(newEvent);
        }

        return super.dispatchKeyEvent(event);
    }
}

