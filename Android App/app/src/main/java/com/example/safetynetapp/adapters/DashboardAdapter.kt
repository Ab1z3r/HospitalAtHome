package com.example.safetynetapp.adapters

import android.app.PendingIntent.getActivity
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat.startActivity
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.safetynetapp.HomeActivity
import com.example.safetynetapp.R
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.Vital
import com.example.safetynetapp.ui.ChartActivity
import com.example.safetynetapp.ui.DashboardFragment
import com.google.firebase.Timestamp
import com.example.safetynetapp.MainActivity
import com.example.safetynetapp.models.UserViewModel
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataType
import java.time.LocalDateTime
import java.time.ZoneId


class DashboardAdapter(val fragment: DashboardFragment, val parentActivity: HomeActivity): RecyclerView.Adapter<DashboardAdapter.DashboardViewHolder>() {
    val model = ViewModelProvider(fragment.requireActivity()).get(DashboardViewModel::class.java)
    val usermodel = ViewModelProvider(fragment.requireActivity()).get(UserViewModel::class.java)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): DashboardAdapter.DashboardViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.dashboard_card, parent, false)
        return DashboardViewHolder(view)
    }

    override fun onBindViewHolder(holder: DashboardViewHolder, position: Int) {
        Log.d("[INFO]", "In onBindViewHolder")
        holder.bind(model.getVitalAt(position))
    }

    override fun getItemCount() = model.size()

    inner class DashboardViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleTextView: TextView = itemView.findViewById(R.id.dashboard_card_title)
        val averageTextView: TextView = itemView.findViewById(R.id.dashboard_card_average)
        val dataTextView: TextView = itemView.findViewById(R.id.dashboard_card_data)
        val timestampTextView: TextView = itemView.findViewById(R.id.dashboard_card_timestamp)

        init {
            itemView.setOnClickListener {
                // TODO: Create updatePos method in view model
                //model.updatePos(adapterPosition)
                // TODO: Navigate to proper detail page
                val intent = Intent(itemView.getContext(), ChartActivity::class.java)
                itemView.getContext().startActivity(intent)
            }
        }

        fun bind(vital: Vital) {
            titleTextView.text = vital.title
            timestampTextView.text = vital.cardTimestamp
            averageTextView.text = "Average"
//            vital.fetchVital(parentActivity, usermodel.googleSigninUser, vital.dataType!!, dataTextView, vital.cardData)
            dataTextView.text = vital.cardData
        }
    }
}