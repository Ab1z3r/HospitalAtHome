package com.example.safetynetapp.ui

import android.app.Activity
import com.github.mikephil.charting.charts.LineChart
import android.widget.RadioGroup
import android.os.Bundle
import android.view.View
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.data.LineData
import java.util.ArrayList

import android.view.ViewGroup

import android.view.LayoutInflater
import androidx.fragment.app.Fragment
import com.example.safetynetapp.R
import com.example.safetynetapp.databinding.FragmentDashboardBinding
import com.example.safetynetapp.databinding.LineChartBinding


class ChartFragment : Fragment() {
    private lateinit var binding: LineChartBinding
    private var lineChart: LineChart? = null
    private var periodRadioGroup: RadioGroup? = null
    private var intervalRadioGroup // for later use
            : RadioGroup? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        super.onCreate(savedInstanceState)
        lineChart = view?.findViewById(R.id.linechart)
        periodRadioGroup = view?.findViewById(R.id.period_radiogroup)
        intervalRadioGroup = view?.findViewById(R.id.interval)
        this.view?.findViewById<View>(R.id.activity_main_getprices)?.setOnClickListener { data }
        return inflater.inflate(R.layout.line_chart, container, false)
    }

    private val data: Unit
        private get() {
            val data = ArrayList<Entry>()
            data.add(Entry(0F, 75F))
            data.add(Entry(1F, 73F))
            data.add(Entry(2F, 80F))
            data.add(Entry(3F, 80F))
            data.add(Entry(4F, 85F))
            data.add(Entry(5F, 90F))
            data.add(Entry(6F, 75F))
            data.add(Entry(7F, 83F))
            setLineChartData(data)
        }

    private fun setLineChartData(data: ArrayList<Entry>) {
        val dataSets = ArrayList<ILineDataSet>()
        val highLineDataSet = LineDataSet(data, "Blood Pressure")
        highLineDataSet.setDrawCircles(true)
        highLineDataSet.circleRadius = 4f
        highLineDataSet.setDrawValues(false)
        highLineDataSet.lineWidth = 3f
        highLineDataSet.color = R.color.unionHealth
        highLineDataSet.setCircleColor(R.color.unionHealth)
        dataSets.add(highLineDataSet)
        val lineData = LineData(dataSets)
        lineChart!!.data = lineData
        lineChart!!.invalidate()
    }
}