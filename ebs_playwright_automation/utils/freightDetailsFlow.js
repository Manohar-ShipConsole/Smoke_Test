import { FreightDetails } from '../pages_objects/FreightDetails.js';

export async function handleFreightDetails(page, row) {

  const freightDetails = new FreightDetails(page);
  await freightDetails.openFreightDetails();

  // const bolNumber     = row.BOLNumber || "";
  // const poNumber      = row.PONumber || "";
  const handlingUnits = row.HandlingUnits || "";
  const freightPkgType= row.FreightPackagingType || "";
  const pieces        = row.Pieces || "";
  const classValue    = row.ClassValue || "";
  const freightWeight = row.Weight || "";
  const weightUOM     = row.WeightUOM || "";
  const freightLength = row.Length || "";
  const freightWidth  = row.Width || "";
  const freightHeight = row.Height || "";
  const dimUOM        = row.DimensionsUOM || "";
  // const freightHazmat = (row.HazmatFlag || "").toLowerCase();
  // const nmfc          = row.NMFC || "";
  // const volume        = row.Volume || "";
  // const volumeUnits   = row.VolumeUnits || "";
  


  await freightDetails.enterHandlingUnits(handlingUnits);
  await freightDetails.selectPackagingType(freightPkgType);
  await freightDetails.enterPieces(pieces);
  await freightDetails.selectClass(classValue);
  await freightDetails.enterWeight(freightWeight, weightUOM);
  await freightDetails.enterDimensions(freightLength, freightWidth, freightHeight, dimUOM);
  await freightDetails.enterDescription();

  await freightDetails.saveChanges();
   

  

  // if (bolNumber)      await freightDetails.enterBOLNumber(bolNumber);
  // if (poNumber)       await freightDetails.enterPONumber(poNumber);
  // if (freightHazmat === "yes" || freightHazmat === "y") await freightDetails.enableHazmat();
  // if (nmfc)           await freightDetails.enterNMFC(nmfc);
  // if (volume)         await freightDetails.enterVolume(volume, volumeUnits);
 
}
