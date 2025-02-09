import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const Dashboard = ({ fileUploaded }) => {
  const [histogramData, setHistogramData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendURL = "https://predictivemain.onrender.com";

  const WARNING_THRESHOLD = 122;
  const CRITICAL_THRESHOLD = 45;

  useEffect(() => {
    if (!fileUploaded) return;

    const fetchHistogramData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendURL}/load-data`);
        const finalRULData = response.data.final_data_RUL || [];

        console.log("Received final_data_RUL:", finalRULData); // ✅ Log received data

        if (!Array.isArray(finalRULData) || finalRULData.length === 0) {
          console.warn("⚠️ No valid data found for final_data_RUL.");
          setLoading(false);
          return;
        }

        // Process histogram data
        const binSize = 10;
        const bins = finalRULData.reduce((acc, item) => {
          const bin = Math.floor(item.Predicted_RUL / binSize) * binSize;
          acc[bin] = (acc[bin] || 0) + 1;
          return acc;
        }, {});

        const histogram = Object.entries(bins).map(([bin, count]) => ({ bin: Number(bin), count }));
        console.log("Histogram Data:", histogram); // ✅ Log histogram data
        setHistogramData(histogram);

        // Process pie chart data
        let lowRisk = 0, mediumRisk = 0, highRisk = 0;
        finalRULData.forEach((item) => {
          if (item.Predicted_RUL > WARNING_THRESHOLD) lowRisk++;
          else if (item.Predicted_RUL > CRITICAL_THRESHOLD) mediumRisk++;
          else highRisk++;
        });

        const pieChart = [
          { name: "Low Risk", value: lowRisk },
          { name: "Medium Risk", value: mediumRisk },
          { name: "High Risk", value: highRisk },
        ];
        console.log("Pie Chart Data:", pieChart); // ✅ Log pie chart data
        setPieChartData(pieChart);

      } catch (error) {
        console.error("Error fetching final_data_RUL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistogramData();
  }, [fileUploaded]);

  const COLORS = ["#00C49F", "#FFBB28", "#FF3D00"];

  return (
    <div className="content p-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-white">📊 Sentinel Dashboard</h2>
          <p className="text-white">Real-time insights and analytics</p>
        </Col>
      </Row>

      <Row className="mb-4">
        {[
          { title: "🚨 High Risk Failures", text: `${pieChartData.find(d => d.name === "High Risk")?.value || 0} Components at High Risk` },
          { title: "🔄 Remaining Useful Life", text: "Avg. 120 hours per component" },
          { title: "⚠️ Anomalies Detected", text: "2 Unusual Patterns Found" },
        ].map((item, index) => (
          <Col md={4} key={index}>
            <Card className="p-3 shadow-sm bg-dark text-light">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {!loading && histogramData.length > 0 && (
        <Row className="mt-4">
          <Col md={6}>
            <Card className="p-4 shadow-sm bg-dark text-light">
              <Card.Body>
                <Card.Title>📊 RUL Distribution</Card.Title>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={histogramData}>
                    <XAxis dataKey="bin" label={{ value: "Remaining Useful Life (RUL)", position: "insideBottom", dy: 10 }} />
                    <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="blue" />
                    <ReferenceLine x={WARNING_THRESHOLD} stroke="orange" strokeDasharray="4 4" label="Warning Threshold" />
                    <ReferenceLine x={CRITICAL_THRESHOLD} stroke="red" strokeDasharray="4 4" label="Critical Threshold" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 shadow-sm bg-dark text-light">
              <Card.Body>
                <Card.Title>📊 Machine Health Risk</Card.Title>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;














