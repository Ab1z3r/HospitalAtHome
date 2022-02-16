package com.example.safetynetapp.models

import androidx.lifecycle.ViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions

class UserViewModel : ViewModel() {

    var user = User()
    lateinit var googleSigninUser: GoogleSignInAccount
    lateinit var fitnessoptions: FitnessOptions
}
