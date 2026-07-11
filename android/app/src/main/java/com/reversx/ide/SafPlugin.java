package com.reversx.ide;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;
import android.util.Log;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Saf")
public class SafPlugin extends Plugin {

    @PluginMethod
    public void pickDirectory(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(call, intent, "pickDirectoryResult");
    }

    @ActivityCallback
    private void pickDirectoryResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            Intent data = result.getData();
            if (data != null && data.getData() != null) {
                Uri uri = data.getData();
                try {
                    getContext().getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                } catch (Exception e) {
                    Log.e("SafPlugin", "Failed to take persistable URI permission", e);
                }
                
                DocumentFile documentFile = DocumentFile.fromTreeUri(getContext(), uri);
                if (documentFile != null) {
                    JSObject ret = new JSObject();
                    ret.put("uri", uri.toString());
                    ret.put("name", documentFile.getName());
                    call.resolve(ret);
                } else {
                    call.reject("Could not get directory details");
                }
            } else {
                call.reject("No directory selected");
            }
        } else {
            call.reject("User cancelled");
        }
    }

    @PluginMethod
    public void listFiles(PluginCall call) {
        String uriStr = call.getString("uri");
        if (uriStr == null) {
            call.reject("Must provide uri");
            return;
        }
        Uri uri = Uri.parse(uriStr);
        DocumentFile documentFile = DocumentFile.fromTreeUri(getContext(), uri);
        if (documentFile != null && documentFile.isDirectory()) {
            JSArray files = new JSArray();
            for (DocumentFile file : documentFile.listFiles()) {
                JSObject fileObj = new JSObject();
                fileObj.put("uri", file.getUri().toString());
                fileObj.put("name", file.getName());
                fileObj.put("isDirectory", file.isDirectory());
                fileObj.put("size", file.length());
                fileObj.put("type", file.getType());
                fileObj.put("lastModified", file.lastModified());
                files.put(fileObj);
            }
            JSObject ret = new JSObject();
            ret.put("files", files);
            call.resolve(ret);
        } else {
            call.reject("Invalid directory uri");
        }
    }

    @PluginMethod
    public void readFile(PluginCall call) {
        String uriStr = call.getString("uri");
        if (uriStr == null) {
            call.reject("Must provide uri");
            return;
        }
        Uri uri = Uri.parse(uriStr);
        try {
            InputStream is = getContext().getContentResolver().openInputStream(uri);
            if (is != null) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                StringBuilder stringBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line).append("\n");
                }
                is.close();
                JSObject ret = new JSObject();
                ret.put("data", stringBuilder.toString());
                call.resolve(ret);
            } else {
                call.reject("Could not open input stream");
            }
        } catch (Exception e) {
            call.reject("Failed to read file", e);
        }
    }

    @PluginMethod
    public void writeFile(PluginCall call) {
        String uriStr = call.getString("uri");
        String data = call.getString("data", "");
        if (uriStr == null) {
            call.reject("Must provide uri");
            return;
        }
        Uri uri = Uri.parse(uriStr);
        try {
            OutputStream os = getContext().getContentResolver().openOutputStream(uri, "wt");
            if (os != null) {
                os.write(data.getBytes(StandardCharsets.UTF_8));
                os.close();
                call.resolve();
            } else {
                call.reject("Could not open output stream");
            }
        } catch (Exception e) {
            call.reject("Failed to write file", e);
        }
    }
}
