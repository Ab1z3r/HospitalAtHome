package com.example.safetynetapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.safetynetapp.R
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.Vital
import com.example.safetynetapp.ui.DashboardFragment
import com.google.firebase.Timestamp

class DashboardAdapter(val fragment: DashboardFragment): RecyclerView.Adapter<DashboardAdapter.DashboardViewHolder>() {
    val model = ViewModelProvider(fragment.requireActivity()).get(DashboardViewModel::class.java)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): DashboardAdapter.DashboardViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.dashboard_card, parent, false)
        return DashboardViewHolder(view)
    }

    override fun onBindViewHolder(holder: DashboardViewHolder, position: Int) {
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
            }
        }

        fun bind(vital: Vital) {
            titleTextView.text = vital.title
            dataTextView.text = vital.cardData
            timestampTextView.text = vital.cardTimestamp
        }
    }
}