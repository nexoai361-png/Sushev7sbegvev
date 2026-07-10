package com.reversx.ide;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TermuxDetectorPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

