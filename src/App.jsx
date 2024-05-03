import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

function BusService({ busArrivalData }) {
  return (
    <ul className="list-unstyled d-flex flex-column mt-5 gap-4">
      {busArrivalData.services.map((service) => (
        <li 
          key={service.bus_no} 
          className="d-flex justify-content-between align-items-center px-4 py-3 border border-dark rounded-pill"
          role="listitem"
        >
          <span className="fs-4"><strong>Bus {service.bus_no}</strong></span>
          <span className="fs-4">
            {service.next_bus_mins < 0 ? (
              <strong className="text-success">Arrived</strong>
            ) : (
              <strong>{service.next_bus_mins} min(s)</strong>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

async function fetchBusArrival(id) {
  const response = await fetch(`https://sg-bus-arrivals-sigma-schoolsc1.replit.app/?id=${id}`);
  const data = await response.json();
  return data;
}

export default function App(){
  const [busStopId, setBusStopId] = useState('');
  const [busArrivalData, setBusArrivalData] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleInputChange(event) {
    setBusStopId(event.target.value);
  }

  useEffect(() => {
    if (busStopId) {
      setLoading(true);
      fetchBusArrival(busStopId)
        .then((data) => setBusArrivalData(data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [busStopId])

  return (
    <>
      <Row className="vh-100">
        <Col lg={6} className="d-flex flex-column gap-3 px-5 py-2 py-md-5 ">
          <div className="d-flex justify-content-center">
            <img src="src\assets\img\bus.png" className="img-fluid"/>
          </div>
          <div className="px-4">
            <h1 style={{ fontSize: '64px', fontWeight: 'bold'}} >Bus Arrival App</h1>
            <p className="mt-3" style={{ fontSize: '20px'}}>
              To experience the app, please enter the number 18141 or visit <u>this link</u> to find your bus number.
            </p>
          </div>
        </Col>
        <Col lg={6} className="d-flex flex-column bg-light" style={{ padding: '80px'}}>
          <div>
              <Form.Group className="mb-3" controlId="formBusStopId">
                <Form.Label className="fw-bold fs-6">Bus Stop ID</Form.Label>
                <Form.Control type="number" className="px-3 py-3 rounded-pill" value={busStopId} onChange={handleInputChange}/>
              </Form.Group>
          </div>

          <div className="mt-4 flex-grow-1">
            {loading && (
              <>
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                  <img src="src\assets\svg\bus.svg" alt="bus" />
                  <h1 className="fs-1 fw-bold" style={{ color: '#B8BDCE' }}>Loading...</h1>
                </div>
              </>
            )}
            {!loading && busArrivalData && busArrivalData.services && (
              <>
                <h1 className="fw-bold">Bus Stop 18141</h1>
                <BusService busArrivalData={busArrivalData} />
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}