package com.example.safetynetapp.models

import java.io.Serializable

data class User(
    var userPictureURI: String = "",
    var displayName: String = "",
    var username: String = "",
    var firstName: String = "",
    var lastName: String = "",
    var email: String = "",
    var phone: String = "",
    var birthdate: String = "",
    var gender: String = "",
    var country: String = ""
) : Serializable {
    companion object {
        const val COLLECTION_PATH = "patients"
    }
}




//import java.io.Serializable
//
//class User() : Serializable {
//
//    private var userPictureURI: String = ""
//    private var displayName: String = ""
//    private var username: String = ""
//
//
//
//    constructor(displayName: String, userPictureURI: String, username: String) : this() {
//        this.displayName = displayName
//        this.userPictureURI = userPictureURI
//        this.username = username
//    }
//
//    fun getdisplayName(): String{
//        return this.displayName
//    }
//    fun getterPictureURI(): String{
//        return this.userPictureURI
//    }
//    fun getusername(): String{
//        return this.username
//    }
//    fun setterdisplayName(displayName: String){
//        this.displayName = displayName
//    }
//
//    fun setuserPictureURI(userPictureURI: String){
//        this.userPictureURI = userPictureURI
//    }
//    fun setterusername(username: String){
//        this.username = username
//    }
//}
