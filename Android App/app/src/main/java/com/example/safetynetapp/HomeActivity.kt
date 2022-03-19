package com.example.safetynetapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.bumptech.glide.Glide
import com.example.safetynetapp.databinding.ActivityHomeBinding
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.User
import com.example.safetynetapp.models.UserViewModel
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import com.google.android.material.navigation.NavigationView
import de.hdodenhof.circleimageview.CircleImageView
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.concurrent.TimeUnit


class HomeActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityHomeBinding
    private lateinit var heightVal: TextView
    private lateinit var callButton: ImageButton
    private var loggedInUser: User? = null
    private var fitnessOptions: FitnessOptions? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarHome.toolbar)

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_home)
        callButton = findViewById<ImageButton>(R.id.call_button)
        callButton.setOnClickListener{
            call_button_listener()       }
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_dashboard, R.id.nav_profile, R.id.nav_settings
            ), drawerLayout
        )

        val tempintent = intent
        loggedInUser = tempintent.getSerializableExtra("loggedInUser") as User?
        if (loggedInUser == null) {
            Log.d("[ERROR]", "Could not find loggedInUser in Home Screen")
            startActivity(Intent(this@HomeActivity, HomeActivity::class.java))
        }

//        val fabbutton = findViewById<FloatingActionButton>(R.id.fab)
        heightVal = findViewById<TextView>(R.id.heightVal)
        val displayImage = binding.navView.getHeaderView(0)
            .findViewById<CircleImageView>(R.id.profile_picture_image_view)
        val displayNameTextView =
            binding.navView.getHeaderView(0).findViewById<TextView>(R.id.display_name_text_view)
        val usernameTextView =
            binding.navView.getHeaderView(0).findViewById<TextView>(R.id.username_text_view)
        val uriOfImage: String? = loggedInUser?.userPictureURI

//        fabbutton.setOnClickListener {
//            getData()
//        }

        Glide.with(this).load(uriOfImage).into(displayImage)
        displayNameTextView.setText(loggedInUser?.displayName)
        usernameTextView.setText(loggedInUser?.username)

        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)


        fitnessOptions = FitnessOptions.builder()
            .addDataType(DataType.TYPE_HEART_RATE_BPM, FitnessOptions.ACCESS_READ)
            .addDataType(DataType.TYPE_HEIGHT, FitnessOptions.ACCESS_READ)
            .addDataType(DataType.TYPE_WEIGHT, FitnessOptions.ACCESS_READ)
            .build()

         var usermodel = ViewModelProvider(this@HomeActivity).get(UserViewModel::class.java)
        usermodel.user = loggedInUser!!
        usermodel.googleSigninUser = getGoogleAccount()
        usermodel.fitnessoptions = fitnessOptions!!


        if (!hasPermissions()) {
            getPermissions()
        }
    }

    private fun call_button_listener(){
//        Log.d("[INFO]", "Call button pressed")
//        val intent = Intent(this@HomeActivity, Call_Activity::class.java)
//        startActivity(intent)
    }

    private fun hasPermissions(): Boolean {
        Log.d("[INFO] hasPermissions: ", GoogleSignIn.hasPermissions(getGoogleAccount(), fitnessOptions).toString())
        return GoogleSignIn.hasPermissions(getGoogleAccount(), fitnessOptions)
    }

    private fun getPermissions() {
        GoogleSignIn.requestPermissions(
            this@HomeActivity,
            1,
            getGoogleAccount(),
            fitnessOptions
        )
    }

    fun getData(dataType: DataType) {
        // Read the data that's been collected throughout the past week.
        val endTime = LocalDateTime.now().atZone(ZoneId.systemDefault())
        val startTime = endTime.minusWeeks(1)



        Fitness.getHistoryClient(this, getGoogleAccount())
            .readDailyTotal(dataType)
            .addOnSuccessListener { response ->
                // The aggregate query puts datasets into buckets, so flatten into a
                // single list of datasets
                Log.d("[INFO]", "in gethistory success listener")
                Log.d("[INFO]", "Data points:" + response.dataPoints)
                for (dataSet in response.dataPoints) {
                    Log.d("[INFO]", "Dumping DataSet")
                    dumpDataSet(dataSet)
                }
            }
            .addOnFailureListener { e ->
                Log.w("[ERROR]", "There was an error reading data from Google Fit", e)
            }
    }

    private fun getGoogleAccount(): GoogleSignInAccount {
        return GoogleSignIn.getAccountForExtension(this@HomeActivity, fitnessOptions)
    }

    private fun dumpDataSet(dp: DataPoint) {

        val METERS_PER_FOOT: Double = 0.3048;
        val INCHES_PER_FOOT: Double = 12.0;
        val heightInMetersstr: String = dp.getValue(dp.dataType.fields[0]).toString();
        val heightInMeters: Double = heightInMetersstr.toDouble()
        val heightInFeet = heightInMeters / METERS_PER_FOOT;
        val feet: Int = heightInFeet.toInt();
        val inches: Int = ((heightInFeet - feet) * INCHES_PER_FOOT + 0.5).toInt();
        heightVal.text = feet.toString().plus("''$inches'")

    }


    private fun DataPoint.getStartTimeString() =
        Instant.ofEpochSecond(this.getStartTime(TimeUnit.SECONDS))
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime().toString()

    private fun DataPoint.getEndTimeString() =
        Instant.ofEpochSecond(this.getEndTime(TimeUnit.SECONDS))
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime().toString()

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
//        menuInflater.inflate(R.menu.home, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_home)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

}