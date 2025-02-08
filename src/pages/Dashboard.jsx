import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
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
          { title: "🚨 High Risk Failures", text: "3 Components at High Risk" },
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

      <Row>
        <Col>
          <Card className="p-4 shadow-sm bg-dark text-light text-center">
            <Card.Body>
              <Card.Title>📈 Equipment Health Overview</Card.Title>
              <p>Graph will be displayed here</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;







