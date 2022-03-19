package com.example.safetynetapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import com.example.safetynetapp.databinding.ActivityMainBinding
import com.example.safetynetapp.models.User
import com.google.android.gms.auth.api.identity.BeginSignInRequest
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase


private lateinit var mGoogleSignInClient: GoogleSignInClient
private lateinit var signInRequest: BeginSignInRequest
private const val REQ_ONE_TAP = 9001
var singlePatientFragment = SinglePatientFragment.newInstance("")

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = Firebase.auth

        // Google sign in button
        val googleSignInButton =findViewById<Button>(R.id.google_sign_in_button)

        // Setting up firebase auth
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.Android_client_id))
            .requestEmail()
            .build()



        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        /*
        Check to see if there is already a google account signed in to the app
         */
        if(isSignedIn()){
            Log.d("[INFO]", "already logged in bro")
            //alreadySignedIn()
        }

        googleSignInButton.setOnClickListener{
            startOneTapUI()
            //alreadySignedIn()
        }

       // setListeners()
    }

    //swap fragment without logging in
    fun  setListeners(){
        var switchTo = singlePatientFragment

//        if(switchTo != null){
//            val ft = supportFragmentManager.beginTransaction()
//            ft.replace(R.id.fragment_container, switchTo)
//            ft.commit()
//        }

//        findViewById<Button>(R.id.login_button).setOnClickListener { _ ->
//            val ft = supportFragmentManager.beginTransaction()
//            ft.replace(R.id.fragment_container, switchTo)
//            ft.commit()
//        }
    }


    fun alreadySignedIn(){
        val account: GoogleSignInAccount = GoogleSignIn.getLastSignedInAccount(this)!!

        try {
            val loggedInUser = User(displayName = account.displayName!!, userPictureURI = account.photoUrl.toString(), username = account.email!!)
            val intent = Intent(this@MainActivity, HomeActivity::class.java)
            intent.putExtra("loggedInUser", loggedInUser)
            startActivity(intent)
            // Signed in successfully, show authenticated UI.
        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w("[ERROR]", "signInResult:failed code=" + e.statusCode)
        }
    }

    private fun startOneTapUI(){
        Log.d("[INFO]", "In Start One Tap UI")
        val signInIntent = mGoogleSignInClient.signInIntent
        startActivityForResult(signInIntent, REQ_ONE_TAP)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        Log.d("[INFO]", "in activity result")
        when (requestCode) {
            REQ_ONE_TAP -> {
                val task: Task<GoogleSignInAccount> = GoogleSignIn.getSignedInAccountFromIntent(data)
                try {
                    // Google Sign In was successful, authenticate with Firebase
                    val account = task.getResult(ApiException::class.java)!!
                    Log.d("[INFO]", "firebaseAuthWithGoogle:" + account.id)
                    firebaseAuthWithGoogle(account.idToken!!)
                } catch (e: ApiException) {
                    // Google Sign In failed, update UI appropriately
                    Log.w("[ERROR]", "Google sign in failed", e)
                }
                handleSignInResult(task)
            }
        }
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign in success, update UI with the signed-in user's information
                    Log.d("[INFO]", "signInWithCredential:success")
                    val user = auth.currentUser
                } else {
                    // If sign in fails, display a message to the user.
                    Log.w("[ERROR]", "signInWithCredential:failure", task.exception)
                }
            }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            Log.d("[INFO]", "Handling sign in")

            val account = completedTask.getResult(ApiException::class.java)
            val loggedInUser = User(displayName = account.displayName!!, userPictureURI = account.photoUrl.toString(), username = account.email!!)

            val intent = Intent(this@MainActivity, HomeActivity::class.java)
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

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.profile_menu, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_home)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

}