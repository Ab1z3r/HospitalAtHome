package com.example.safetynetapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.widget.ImageView
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.navigation.NavigationView
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import androidx.drawerlayout.widget.DrawerLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.safetynetapp.databinding.ActivityHomeScreenBinding
import com.example.safetynetapp.model.User
import com.bumptech.glide.Glide
import android.widget.TextView
import de.hdodenhof.circleimageview.CircleImageView


class HomeScreen : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityHomeScreenBinding
    private var loggedInUser: User? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeScreenBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_home_screen)
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home
            ), drawerLayout
        )


        val tempintent = intent
        loggedInUser = tempintent.getSerializableExtra("loggedInUser") as User?
        if(loggedInUser == null){
            Log.d("[ERROR]", "Could not find loggedInUser in Home Screen")
            startActivity(Intent(this@HomeScreen, MainActivity::class.java))
        }

        val displayImage = binding.navView.getHeaderView(0).findViewById<CircleImageView>(R.id.profile_picture_image_view)
        val displayNameTextView = binding.navView.getHeaderView(0).findViewById<TextView>(R.id.display_name_text_view)
        val usernameTextView = binding.navView.getHeaderView(0).findViewById<TextView>(R.id.username_text_view)
        val uriOfImage: String? = loggedInUser?.getterPictureURI()

        Glide.with(this).load(uriOfImage).into(displayImage)
        displayNameTextView.setText(loggedInUser?.getdisplayName())
        usernameTextView.setText(loggedInUser?.getusername())

        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.home_screen, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_home_screen)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

}