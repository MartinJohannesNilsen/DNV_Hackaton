// @ts-nocheck
import React, { useState } from "react";
import "./App.scss";
import axios from "axios";
import {
	Card,
	Box,
	FormControl,
	OutlinedInput,
	InputAdornment,
	Fab,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Slider,
	Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function App() {
	//States
	const [distance, setDistance] = useState(5116);
	const [avgSpeed, setAvgSpeed] = useState(10.75);
	const [vessels, setVessels] = useState(require("./data/json/Vessels.json"));
	const [resultJSON, setResultJSON] = useState([]);
	
	//Handlers
	const handleSpeedChange = (event, newValue) => {
		setAvgSpeed(newValue);
	};
	const handleDistanceChange = (event, newValue) => {
		setDistance(newValue);
	  };


	//This method is fired when the calulatebutton is pressed
	const handleClickOnCalculateButton = () => {
		//If all values are filled in correctly, calulcate, else show warning
		if (
			distance > 0 && 
			avgSpeed >= 6 && avgSpeed <= 15.5
		) {
			document.getElementById("missingInputWarning").classList.remove("Show");
			showCalculatedResult();
		} else {
			document.getElementById("missingInputWarning").classList.add("Show");
			document.getElementById("ResultContainer").classList.add("Hidden");
		}
	};

	//This method handles the showing of the calculated result
	const showCalculatedResult = () => {
		calculateEMC();
		document.getElementById("ResultContainer").classList.remove("Hidden");
	};
	
	const calculateEMC = () => {
		setResultJSON([])
		vessels.map(vessel => { 
			let imo = vessel.IMO
			let config = {
				method: 'get',
				url: 'https://api.veracity.com/df/ec-api-hackaton/emissions-calculation?imo='+imo+'&avg_speed_kn='+avgSpeed+'&distance_nm='+distance+'&load_cond=laden&cargo_unit=&cargo_amt=&me_fuel_type=&ae_fuel_type=HFO&boiler_fuel_type=HFO',
				headers: { 
				'Ocp-Apim-Subscription-Key': 'e6b5a7e80f3d457caa9209df8745c557'
				}
			};
			axios(config)
			.then(response => response.data)
			.then((response) => {
				let t = 2500000
				let c = 84
				let possible_trips = Math.floor(365/((response.duration_h/24)+10))
				let amount = Math.ceil(t/vessel.PermissibleIntake)
				response["amount"] = possible_trips
				response["type"] = vessel.Type
				response["days"] = Math.ceil(((response.duration_h/24)+10)*possible_trips)
				response["grain_carried"] = vessel.PermissibleIntake*possible_trips
				response["total_co2_emission_metric_tons"] = response.total_co2_emission_metric_tons*possible_trips
				response["grain_co2_ratio"] = response["grain_carried"]/response["total_co2_emission_metric_tons"]
				response["emission_tons_per_day"] = response["total_co2_emission_metric_tons"]/response["days"]
				response["emission_tons_per_ton_carried"] = response["total_co2_emission_metric_tons"]/response["grain_carried"]
				response["emission_cost_per_day"] = response["total_co2_emission_metric_tons"]*c/response["days"]
				response["emission_cost_per_ton_carried"] = response["total_co2_emission_metric_tons"]*c/response["grain_carried"]
				setResultJSON(oldArray => [...oldArray, response])
			})
			.catch(error => {console.log(error)})	
		});
		// console.log(resultJSON)
	};


	return (
		<Box className="App">
			<Card className="Container" style={{textAlign: "center"}}>
				<h1>Shipping coordinator tool</h1>
			</Card>
			<Card className="Container">
				<Box className="IntroContainer">
					<h2>Welcome</h2>
					<h3>
						Let us find the solution of your shipping needs 🦦
					</h3>
					<hr />
				</Box>

				<Box className="InputContainer">
					<h3>Nautic miles:</h3>
					<FormControl fullWidth variant="outlined">
						<OutlinedInput
							value={distance || null}
							onChange={handleDistanceChange}
							endAdornment={<InputAdornment position="end">nm</InputAdornment>}
							aria-label="distance in nm"
							type="number"
							inputProps={{ "data-testid": "inputFieldDistance" }}
							onClick={() =>
								document
									.getElementById("ResultContainer")
									.classList.add("Hidden")
							}
							disabled
						/>
					</FormControl>
					<h3>Average speed:</h3>
					<FormControl fullWidth variant="outlined">
						<OutlinedInput
							value={avgSpeed || null}
							onChange={handleSpeedChange}
							endAdornment={<InputAdornment position="end">kts</InputAdornment>}
							aria-label="speed"
							type="number"
							inputProps={{ "data-testid": "inputFieldAvgSpeed", "step": "0.05"}}
							onClick={() =>
								document
									.getElementById("ResultContainer")
									.classList.add("Hidden")
							}
							disabled
						/>
						<Grid container spacing={2}>
							<Grid item>
							<p>ECO</p>
							</Grid>
							<Grid item xs>
							<Slider aria-label="Speed" value={avgSpeed} onChange={handleSpeedChange} 
									min={6} max={15.5} step={0.05}/>
							</Grid>
							<Grid item>
							<p>Fast af boi</p>
							</Grid>
						</Grid>

					</FormControl>
				</Box>

				<p className="ErrorMessage" id="missingInputWarning">
					One of the rules have been broken!
				</p>

				<Box className="CalculateButtonContainer">
					<Fab
						onClick={handleClickOnCalculateButton}
						aria-labelledby="Calculate"
						variant="extended"
						alt="Calculatebutton"
						id="calculateButton"
					>
						<h2>Show list of vessels</h2>
					</Fab>
				</Box>
			</Card>

			<Card className="Container Hidden" id="ResultContainer">
				
				<h1>Maximum amount of trips per vessel in a year</h1>
				<table>
					<tr>
						<th>Amount</th>
						<th>IMO</th> 
						<th>Type</th> 
						<th>Total days</th> 
						<th>Tons grain</th> 
						<th>CO2 emission</th> 
						<th>Grain-Co2 ratio</th> 
					</tr>
					{resultJSON.sort((a, b) => {return a.total_co2_emission_metric_tons > b.total_co2_emission_metric_tons}).map((vessel) => (
						<tr>
							<td align="center" valign="middle">{vessel.amount}</td>
							<td align="center" valign="middle">{vessel.imo}</td>
							<td align="center" valign="middle">{vessel.type}</td>
							<td align="center" valign="middle">{vessel.days}</td>
							<td align="center" valign="middle">{vessel.grain_carried}</td>
							<td align="center" valign="middle">{vessel.total_co2_emission_metric_tons.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.grain_co2_ratio.toFixed(2)}</td>
						</tr>
					))}
				</table>
				
				<h1>Vessel options based on CO2 tons</h1>
				<table>
					<tr>
						<th>Amount</th>
						<th>IMO</th> 
						<th>Type</th> 
						<th>Total days</th> 
						<th>Tons grain</th> 
						<th>CO2 emission</th> 
						<th>Grain-Co2 ratio</th> 
						<th>Tons CO2 per tons grain</th> 
						<th>Tons CO2 per day</th>  
					</tr>
					{resultJSON.sort((a, b) => {return a.emission_tons_per_day > b.emission_tons_per_day}).map((vessel) => (
						<tr>
							<td align="center" valign="middle">{vessel.amount}</td>
							<td align="center" valign="middle">{vessel.imo}</td>
							<td align="center" valign="middle">{vessel.type}</td>
							<td align="center" valign="middle">{vessel.days}</td>
							<td align="center" valign="middle">{vessel.grain_carried}</td>
							<td align="center" valign="middle">{vessel.total_co2_emission_metric_tons.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.grain_co2_ratio.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.emission_tons_per_ton_carried.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.emission_tons_per_day.toFixed(2)}</td>
						</tr>
					))}
				</table>

				<h1>Vessel options based on CO2 costs</h1>
				<table>
					<tr>
						<th>Amount</th>
						<th>IMO</th> 
						<th>Type</th> 
						<th>Total days</th> 
						<th>Tons grain</th> 
						<th>CO2 emission</th> 
						<th>Grain-Co2 ratio</th> 
						<th>CO2 cost per tons</th> 
						<th>CO2 cost per day</th>  
					</tr>
					{resultJSON.sort((a, b) => {return a.mission_cost_per_day < b.mission_cost_per_day}).map((vessel) => (
						<tr>
							<td align="center" valign="middle">{vessel.amount}</td>
							<td align="center" valign="middle">{vessel.imo}</td>
							<td align="center" valign="middle">{vessel.type}</td>
							<td align="center" valign="middle">{vessel.days}</td>
							<td align="center" valign="middle">{vessel.grain_carried}</td>
							<td align="center" valign="middle">{vessel.total_co2_emission_metric_tons.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.grain_co2_ratio.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.emission_cost_per_ton_carried.toFixed(2)}</td>
							<td align="center" valign="middle">{vessel.emission_cost_per_day.toFixed(2)}</td>
						</tr>
					))}
				</table>
				
				<hr />
				<Accordion className="Accordion">
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="Information about calculation"
					>
						<p>How is this calculated?</p>
					</AccordionSummary>
					<AccordionDetails className="AccordionContainer">
						<div></div>
					</AccordionDetails>
				</Accordion>
			</Card>
		</Box>
	);
}

export default App;
