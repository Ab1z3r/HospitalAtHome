package com.example.safetynetapp.ui

import android.app.Activity
import android.os.Bundle
import android.view.View
import android.widget.RadioGroup
import com.example.safetynetapp.R
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet

class ChartActivity : Activity() {
    private var lineChart: LineChart? = null
    private var periodRadioGroup: RadioGroup? = null
    private var intervalRadioGroup // for later use
            : RadioGroup? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_single_vital)
        lineChart = findViewById(R.id.linechart)
        periodRadioGroup = findViewById(R.id.period_radiogroup)
        intervalRadioGroup = findViewById(R.id.interval)
        findViewById<View>(R.id.activity_main_getprices).setOnClickListener { data }
    }

    private val data: Unit
        private get() {
            val data = ArrayList<Entry>()


//            data.add(Entry(0, 75))
//            data.add(Entry(1, 73))
//            data.add(Entry(2, 80))
//            data.add(Entry(3, 80))
//            data.add(Entry(4, 85))
//            data.add(Entry(5, 90))
//            data.add(Entry(6, 75))
//            data.add(Entry(7, 83))

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
