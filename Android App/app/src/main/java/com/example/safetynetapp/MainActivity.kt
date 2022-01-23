package com.example.safetynetapp

import android.R.attr
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
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import androidx.core.app.ActivityCompat.startActivityForResult
import android.R.attr.data
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import com.google.android.gms.tasks.Task
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import javax.xml.datatype.DatatypeFactory.newInstance


private lateinit var mGoogleSignInClient: GoogleSignInClient
private lateinit var signInRequest: BeginSignInRequest
private const val REQ_ONE_TAP = 2
var singlePatientFragment =  SinglePatientFragment.newInstance("")


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Google sign in button
        val googleSignInButton =findViewById<ImageButton>(R.id.google_sign_in_button)

        // Setting up firebase auth
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);


        /*
        Check to see i there is already a google account signed in to the app
         */
        if(isSignedIn()){
            Log.d("[INFO]", "already logged in bro")
            alreadySignedIn()
        }


        googleSignInButton.setOnClickListener{
            startOneTapUI()
            //alreadySignedIn()
        }


        setListeners()
    }


    //swap fragment without logging in
    fun  setListeners(){
        var switchTo = singlePatientFragment

//        if(switchTo != null){
//            val ft = supportFragmentManager.beginTransaction()
//            ft.replace(R.id.fragment_container, switchTo)
//            ft.commit()
//        }

        findViewById<Button>(R.id.login_button).setOnClickListener { _ ->
            val ft = supportFragmentManager.beginTransaction()
            ft.replace(R.id.fragment_container, switchTo)
            ft.commit()
        }
    }


    fun alreadySignedIn(){
        val account: GoogleSignInAccount = GoogleSignIn.getLastSignedInAccount(this)!!

        try {
            //val loggedInUser = User(displayName = account.displayName!!, userPictureURI = account.photoUrl.toString(), username = account.email!!)
            val intent = Intent(this@MainActivity, HomeScreen::class.java)
            //intent.putExtra("loggedInUser", loggedInUser)     uncomment this line
            startActivity(intent)
            // Signed in successfully, show authenticated UI.
        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w("[ERROR]", "signInResult:failed code=" + e.statusCode)
        }

    }

    private fun startOneTapUI(){
        val signInIntent = mGoogleSignInClient.signInIntent
        startActivityForResult(signInIntent, REQ_ONE_TAP)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        when (requestCode) {
            REQ_ONE_TAP -> {
                val task: Task<GoogleSignInAccount> = GoogleSignIn.getSignedInAccountFromIntent(data)
                handleSignInResult(task)
            }
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            Log.d("[INFO]", "Handling sign in")

            val account = completedTask.getResult(ApiException::class.java)
            val loggedInUser = User(displayName = account.displayName!!, userPictureURI = account.photoUrl.toString(), username = account.email!!)

            val intent = Intent(this@MainActivity, HomeScreen::class.java)
            intent.putExtra("loggedInUser", loggedInUser)
            startActivity(intent)

            // Signed in successfully, show authenticated UI.
        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w("[ERROR]", "signInResult:failed code=" + e.statusCode)
        }
    }

    private fun isSignedIn(): Boolean {
        return GoogleSignIn.getLastSignedInAccount(this) != null
    }

    }