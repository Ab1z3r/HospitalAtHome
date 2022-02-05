package com.example.safetynetapp.ui;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioGroup;

import com.example.safetynetapp.R;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import java.util.ArrayList;

public class ChartActivity extends Activity {

    private LineChart lineChart;

    private RadioGroup periodRadioGroup, intervalRadioGroup; // for later use

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.line_chart);

        lineChart = findViewById(R.id.linechart);

        periodRadioGroup = findViewById(R.id.period_radiogroup);
        intervalRadioGroup = findViewById(R.id.interval);

        findViewById(R.id.activity_main_getprices).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getData();
            }
        });
    }

    private void getData() {

                ArrayList<Entry> data = new ArrayList<>();

                data.add(new Entry(0, 75));
                data.add(new Entry(1, 73));
                data.add(new Entry(2, 80));
                data.add(new Entry(3, 80));
                data.add(new Entry(4, 85));
                data.add(new Entry(5, 90));
                data.add(new Entry(6, 75));
                data.add(new Entry(7, 83));

                setLineChartData(data);

    }

    private void setLineChartData(ArrayList<Entry> data) {
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();


            LineDataSet highLineDataSet = new LineDataSet(data, "Blood Pressure");
            highLineDataSet.setDrawCircles(true);
            highLineDataSet.setCircleRadius(4);
            highLineDataSet.setDrawValues(false);
            highLineDataSet.setLineWidth(3);
            highLineDataSet.setColor(R.color.unionHealth);
            highLineDataSet.setCircleColor(R.color.unionHealth);
            dataSets.add(highLineDataSet);


        LineData lineData = new LineData(dataSets);
        lineChart.setData(lineData);
        lineChart.invalidate();
    }
}
