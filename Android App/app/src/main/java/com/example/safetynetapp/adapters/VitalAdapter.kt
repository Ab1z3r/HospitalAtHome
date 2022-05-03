package com.example.safetynetapp.adapters

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.example.safetynetapp.R
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.Vital
import com.example.safetynetapp.models.VitalViewModel
import com.example.safetynetapp.ui.SingleVitalFragment


class VitalAdapter(val fragment: SingleVitalFragment): RecyclerView.Adapter<VitalAdapter.VitalViewHolder>() {
    val model = ViewModelProvider(fragment.requireActivity()).get(DashboardViewModel::class.java)

    var vitalPos = 0

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VitalAdapter.VitalViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.vital_card, parent, false)
        return VitalViewHolder(view)
    }

    override fun onBindViewHolder(holder: VitalViewHolder, position: Int) {
        vitalPos = model.currentPos
        Log.d("MIKE", "vitalPos: $vitalPos, position: $position")
        holder.bind(model.getVitalAt(vitalPos), position)
    }

    override fun getItemCount() = model.vitalSize(model.currentPos)

    fun setPos(pos: Int) {
        vitalPos = pos
    }

    inner class VitalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleTextView: TextView = itemView.findViewById(R.id.vital_card_title)
        val dataTextView: TextView = itemView.findViewById(R.id.vital_card_data)

        init {
            itemView.setOnClickListener {

            }
        }

        fun bind(vital: Vital, pos: Int) {
            titleTextView.text = vital.mapKeyToString(vital.getData().keys.elementAt(pos))
            dataTextView.text = vital.getData().get(vital.getData().keys.elementAt(pos)).toString()
        }
    }
}