package com.reversx.ide;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@CapacitorPlugin(name = "SAF")
public class SAFPlugin extends Plugin {

    @PluginMethod
    public void chooseAndReadDirectory(PluginCall call) {
        saveCall(call);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(call, intent, "pickDirectoryResult");
    }

    @ActivityCallback
    private void pickDirectoryResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("User cancelled or failed to select directory");
            return;
        }

        Uri treeUri = result.getData().getData();
        if (treeUri == null) {
            call.reject("Invalid directory URI");
            return;
        }

        try {
            getContext().getContentResolver().takePersistableUriPermission(
                treeUri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            );
        } catch (Exception e) {
            Log.w("SAFPlugin", "Could not persist URI permission: " + e.getMessage());
        }

        try {
            DocumentFile rootDir = DocumentFile.fromTreeUri(getContext(), treeUri);
            if (rootDir == null || !rootDir.isDirectory()) {
                call.reject("Selected item is not a valid directory");
                return;
            }

            JSObject filesResult = new JSObject();
            traverseDirectory(rootDir, "", filesResult);

            JSObject response = new JSObject();
            response.put("folderName", rootDir.getName());
            response.put("files", filesResult);
            call.resolve(response);
        } catch (Exception e) {
            Log.e("SAFPlugin", "Error reading directory tree", e);
            call.reject("Error reading directory: " + e.getMessage());
        }
    }

    private void traverseDirectory(DocumentFile dir, String relativePath, JSObject result) {
        DocumentFile[] files = dir.listFiles();
        if (files == null) return;

        for (DocumentFile file : files) {
            String name = file.getName();
            if (name == null) continue;

            // Skip hidden or build directories/files
            if (name.equals("node_modules") || name.equals(".git") || name.equals("dist") || 
                name.equals(".next") || name.equals("__MACOSX") || name.equals(".DS_Store")) {
                continue;
            }

            String currentPath = relativePath.isEmpty() ? name : relativePath + "/" + name;
            
            if (file.isDirectory()) {
                traverseDirectory(file, currentPath, result);
            } else if (file.isFile()) {
                // Ignore extremely large files (>2MB) to avoid OOM or bridge choke
                if (file.length() > 2 * 1024 * 1024) {
                    continue;
                }

                String content = readFileContent(file.getUri(), file.getType(), name);
                if (content != null) {
                    JSObject fileObj = new JSObject();
                    fileObj.put("code", content);
                    fileObj.put("language", getLanguageFromExtension(name));
                    result.put(currentPath, fileObj);
                }
            }
        }
    }

    private String readFileContent(Uri uri, String mimeType, String name) {
        try (InputStream inputStream = getContext().getContentResolver().openInputStream(uri)) {
            if (inputStream == null) return null;

            ByteArrayOutputStream result = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                result.write(buffer, 0, length);
            }

            boolean isImage = (mimeType != null && mimeType.startsWith("image/")) ||
                    (name != null && name.toLowerCase().matches(".*\\.(png|jpg|jpeg|gif|svg|webp|ico)$"));

            if (isImage) {
                byte[] bytes = result.toByteArray();
                String base64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
                String prefix = "data:" + (mimeType != null ? mimeType : "image/png") + ";base64,";
                return prefix + base64;
            } else {
                return result.toString("UTF-8");
            }
        } catch (Exception e) {
            Log.e("SAFPlugin", "Failed to read file: " + uri, e);
            return null;
        }
    }

    private String getLanguageFromExtension(String filename) {
        String ext = "";
        int i = filename.lastIndexOf('.');
        if (i > 0) {
            ext = filename.substring(i + 1).toLowerCase();
        }
        switch (ext) {
            case "js":
            case "jsx":
                return "javascript";
            case "ts":
            case "tsx":
                return "typescript";
            case "html":
            case "htm":
                return "html";
            case "css":
                return "css";
            case "json":
                return "json";
            case "md":
                return "markdown";
            case "xml":
                return "xml";
            case "svg":
                return "image";
            default:
                return "plaintext";
        }
    }
}
