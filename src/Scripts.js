import { gapi } from 'gapi-script';

const scriptId = process.env.REACT_APP_GOOGLE_SCRIPT_ID;

function CallAPI(functionName, parameters, setObject, setError) {
  try {
    gapi.client.script.scripts.run({
      'scriptId': scriptId,
      'resource': {
        'function': functionName,
        'parameters': [parameters]
      },
    }).then(function(resp) {
      const result = resp.result;
      if (result.error && result.error.status) {
        // The API encountered a problem before the script
        console.log(result.error);
        setError("Internal Server Error: Try again later or contact system administrator");
      } else if (result.error) {
        // The API executed, but the script returned an error.
        console.log(result.error);
        setError("Access Denied: Please contact administrators for access");
      } else {
        // The structure of the result will depend upon what the Apps
        const resultObject = JSON.parse(result.response.result);
        if(resultObject.status === "Failure") {
          console.log(result);
          if(resultObject.error === "Unable to open spreadsheet") {
            setError("Access Denied: Please contact administrators for access");
          }
          else {
            setError("Internal Server Error: Try again later or contact system administrator");
          }
        }
        else {
          setObject(resultObject);
        }
      }
    });
  } catch (err) {
    console.log(err);
    setError("Internal Server Error: Try again later or contact system administrator");
    return;
  }
}

/**
 * Load the API and make an API call.  Display the results on the screen.
 */
 export function GetAttributes(setObject, setError) {
  CallAPI('API_GetAttributes', {}, setObject, setError);
 }

  /**
 * Load the API and make an API call.  Display the results on the screen.
 */
 export function GetData(parameters, setObject, setError) {
  CallAPI('API_GetData', parameters, setObject, setError);
 }