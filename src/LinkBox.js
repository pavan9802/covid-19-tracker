import React from "react";
import { Card, CardContent } from "@material-ui/core";
import "./LinkBox.css"

function LinkBox() {
    return (
        <div className = "idk">
            <Card className= "linkbox">
            <CardContent>
              
                For more information about Covid-19, please reference these links
                <ul>
                  <li >
                    <a href = "https://www.who.int/emergencies/diseases/novel-coronavirus-2019"> For more about Covid-19 </a>
                  </li>
                  <li >
                    <a href = "https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/covid-19-vaccines-myth-versus-fact">For more about Vaccine Information</a>
                  </li>
                  <li >
                    <a href = "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html">For more about Testing Information</a>
                  </li>
                </ul>
                          
            </CardContent>
             </Card>
        </div>
    )
}

export default LinkBox
