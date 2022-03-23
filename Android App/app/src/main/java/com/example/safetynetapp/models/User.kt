package com.example.safetynetapp.models

import com.google.firebase.Timestamp
import java.io.Serializable
import java.util.*
import javax.xml.datatype.DatatypeConfigurationException

data class User(
    var userPictureURI: String = "",
    var displayName: String = "",
    var username: String = "",
    var googleID: String = "",

    var firstName: String = "",
    var lastName: String = "",
    var email: String = "",
    var phone: String = "",
    var birthdate: Date = Date(),
    var gender: String = "",

    var emContactName: String = "",
    var emContactPhone: String = "",

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
