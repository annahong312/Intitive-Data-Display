import { gapi } from 'gapi-script';

const scriptId = process.env.REACT_APP_GOOGLE_SCRIPT_ID;

/**
 * Load the API and make an API call.  Display the results on the screen.
 */
 export function GetAttributes(setObject) {
    // Call the Apps Script API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)
    try {
      gapi.client.script.scripts.run({
        'scriptId': scriptId,
        'resource': {
          'function': 'API_GetAttributes'
        },
      }).then(function(resp) {
        const result = resp.result;
        if (result.error && result.error.status) {
          // The API encountered a problem before the script
        } else if (result.error) {
          // The API executed, but the script returned an error.
          const error = result.error.details[0];
          // appendPre('Script error message: ' + error.errorMessage);
  
          if (error.scriptStackTraceElements) {
            // There may not be a stacktrace if the script didn't start
            // executing.
            //appendPre('Script error stacktrace:');
            for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
              const trace = error.scriptStackTraceElements[i];
              //appendPre('\t' + trace.function + ':' + trace.lineNumber);
            }
          }
        } else {
          // The structure of the result will depend upon what the Apps
          console.log(result);
          console.log("parsed results: ", JSON.parse(result.response.result));
          setObject(JSON.parse(result.response.result));
        }
      });
    } catch (err) {
        console.log(err);
      return;
    }
  }

  /**
 * Load the API and make an API call.  Display the results on the screen.
 */
 export function GetData(parameters, setObject) {
  // Call the Apps Script API run method
  //   'scriptId' is the URL parameter that states what script to run
  //   'resource' describes the run request body (with the function name
  //              to execute)
  try {
    console.log("Calling with parameters");
    console.log(parameters);
    gapi.client.script.scripts.run({
      'scriptId': scriptId,
      'resource': {
        'function': 'API_GetData',
        'parameters': [parameters]
      },
    }).then(function(resp) {
      const result = resp.result;
      if (result.error && result.error.status) {
        // The API encountered a problem before the script
      } else if (result.error) {
        // The API executed, but the script returned an error.
        const error = result.error.details[0];
        // appendPre('Script error message: ' + error.errorMessage);

        if (error.scriptStackTraceElements) {
          // There may not be a stacktrace if the script didn't start
          // executing.
          //appendPre('Script error stacktrace:');
          for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
            const trace = error.scriptStackTraceElements[i];
            //appendPre('\t' + trace.function + ':' + trace.lineNumber);
          }
        }
      } else {
        // The structure of the result will depend upon what the Apps
        console.log(result);
        setObject(JSON.parse(result.response.result));
      }
    });
  } catch (err) {
      console.log(err);
    return;
  }
}