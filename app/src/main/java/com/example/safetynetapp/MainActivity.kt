package com.example.safetynetapp

import android.content.Intent
import android.content.IntentSender
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.TextView
import com.example.safetynetapp.model.User
import com.google.android.gms.auth.api.identity.BeginSignInRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.identity.SignInClient
import com.google.android.gms.common.api.ApiException
import android.os.StrictMode
import android.os.StrictMode.ThreadPolicy


private lateinit var oneTapClient: SignInClient
private lateinit var signInRequest: BeginSignInRequest
private const val REQ_ONE_TAP = 2


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val googleSignInButton =findViewById<ImageButton>(R.id.google_sign_in_button)

        oneTapClient = Identity.getSignInClient(this)
        signInRequest = BeginSignInRequest.builder()
            .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                .setSupported(true)
                .build())
            .setGoogleIdTokenRequestOptions(
                BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                    .setSupported(true)
                    // Your server's client ID, not your Android client ID.
                    .setServerClientId(getString(R.string.Android_client_id))
                    // Only show accounts previously used to sign in.
                    .setFilterByAuthorizedAccounts(false)
                    .build())
            // Automatically sign in when exactly one credential is retrieved.
            .setAutoSelectEnabled(true)
            .build()

        googleSignInButton.setOnClickListener{
            startOneTapUI()
        }
    }

    fun startOneTapUI(){
        oneTapClient.beginSignIn(signInRequest)
            .addOnSuccessListener(this) { result ->
                try {
                    startIntentSenderForResult(
                        result.pendingIntent.intentSender, REQ_ONE_TAP,
                        null, 0, 0, 0)
                } catch (e: IntentSender.SendIntentException) {
                    Log.e("[ERROR]", "Couldn't start One Tap UI: ${e.localizedMessage}")
                }
            }
            .addOnFailureListener(this) { e ->
                // No Google Accounts found. Just continue presenting the signed-out UI.
                Log.d("[ERROR]", "LAUNCHING ONE TAP UI -> ${e.localizedMessage}")
            }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        Log.d("[INFO]", "onActivity result fired")
        val tv = findViewById<TextView>(R.id.main_text)

        when (requestCode) {
            REQ_ONE_TAP -> {
                try {
                    val credential = oneTapClient.getSignInCredentialFromIntent(data)
                    val displayName = credential.displayName
                    val userPictureURI = credential.profilePictureUri
                    val username = credential.id
                    when {
                        username != null -> {
                            val loggedInUser = User(displayName = displayName, userPictureURI = userPictureURI.toString(), username = username)

                            val intent = Intent(this@MainActivity, HomeScreen::class.java)
                            intent.putExtra("loggedInUser", loggedInUser)
                            startActivity(intent)
                        }
                        else -> {
                            Log.d("[ERROR]", "No Display Name!")
                        }
                    }
                } catch (e: ApiException) {
                    Log.d("[ERROR]", "API EXCEPTION ${e.localizedMessage}")
                }
                }
            }
        }

    }