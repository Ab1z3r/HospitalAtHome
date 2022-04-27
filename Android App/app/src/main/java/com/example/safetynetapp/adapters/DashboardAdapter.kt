package com.example.safetynetapp.adapters

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.example.safetynetapp.HomeActivity
import com.example.safetynetapp.R
import com.example.safetynetapp.models.DashboardViewModel
import com.example.safetynetapp.models.Vital
import com.example.safetynetapp.ui.DashboardFragment
import com.example.safetynetapp.models.UserViewModel

import androidx.navigation.fragment.findNavController
import com.example.safetynetapp.ui.SingleVitalFragment


class DashboardAdapter(val fragment: DashboardFragment, val parentActivity: HomeActivity): RecyclerView.Adapter<DashboardAdapter.DashboardViewHolder>() {
    val model = ViewModelProvider(fragment.requireActivity()).get(DashboardViewModel::class.java)
    val usermodel = ViewModelProvider(fragment.requireActivity()).get(UserViewModel::class.java)
    val dashFragment = DashboardFragment();

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DashboardAdapter.DashboardViewHolder {
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
        val dataRangeTextView: TextView = itemView.findViewById(R.id.dashboard_card_data_range)
        val dataTextView: TextView = itemView.findViewById(R.id.dashboard_card_data)
        val timestampTextView: TextView = itemView.findViewById(R.id.dashboard_card_timestamp)

        init {
            itemView.setOnClickListener {
                // DONE: Create updatePos method in view model
                model.updatePos(adapterPosition)
                // DONE: Navigate to proper detail page
                fragment.findNavController().navigate(R.id.nav_single_vital)
//                val intent = Intent(itemView.getContext(), ChartActivity::class.java)
//                itemView.getContext().startActivity(intent)

//                val cfragment: Fragment = ChartActivity()
//                val dfragment: Fragment = DashboardFragment()
//                val ft : FragmentTransaction = (fragment.requireActivity()).supportFragmentManager.beginTransaction()
//                ft.replace(R.id.fragment_dashborad,cfragment)
//                //ft.attach(cfragment)

 //               ft.commit()

            //               findNavController(fragment).navigate(R.id.line_chart)


            }
        }

        fun bind(vital: Vital) {
            vital.updateCard()
            titleTextView.text = vital.title
            timestampTextView.text = vital.cardTimestamp
            dataRangeTextView.text = "Latest"
//            vital.fetchVital(parentActivity, usermodel.googleSigninUser, vital.dataType, dataTextView, vital.cardData)
            dataTextView.text = vital.cardData
            Log.d("MIKE", "HERE ${vital.cardData}")
        }
    }
}