package edu.rosehulman.testapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        var buttonView: Button = findViewById(R.id.button)
        findViewById<Button>(R.id.button).setOnClickListener {
            GlobalScope.async {
                getHealthData(buttonView)
            }
        }
    }

    suspend fun getData(view: android.view.View) {
        try {
            val result = GlobalScope.async {
                // TODO: add api url
                callOmronAPI("ADD API URL HERE")
            }.await()
            onResponse(result)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun callOmronAPI(apiUrl:String ):String?{
        // TODO: call Omron GET request
        return null
    }

    private fun onResponse(result: String?) {
        try {
            // convert the string to JSON object for better reading
            val resultJson = JSONObject(result)
            // Initialize healthData text
            var healthData ="Health Data \n\n"
            //TODO: get specific health data
            healthData += resultJson.getString("HEALTH DATA NAME")+"\n"
            // Update text with various fields from response
            //Update the healthData to the view
            setText(findViewById(R.id.resultView),healthData)
        } catch (e: Exception) {
            e.printStackTrace()
            findViewById<TextView>(R.id.resultView)!!.text = "Oops!! something went wrong, please try again"
        }
    }

    private fun setText(text: TextView?, value: String) {
        runOnUiThread { text!!.text = value }
    }
}