/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  const result = await fetch(url);
  return await result.arrayBuffer();
}

/**
 * @template T
 * @param {string} url
 * @param {object} params
 * @returns {Promise<T>}
 */
async function fetchJSON(url, params = undefined) {
  const queryParams = new URLSearchParams(params);

  const result = await fetch(`${url}${queryParams === undefined ? '' : '?' + queryParams}`);
  if (!result.ok) {
    throw new Error(await result.json());
  }
  return result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const result = await fetch(url, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    method: 'POST',
    body: file,
  });
  // const result = await $.ajax({
  //   async: false,
  //   data: file,
  //   dataType: 'json',
  //   headers: {
  //     'Content-Type': 'application/octet-stream',
  //   },
  //   method: 'POST',
  //   processData: false,
  //   url,
  // });
  return await result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const jsonString = JSON.stringify(data);

  const result = await fetch(url, {
    body: jsonString,
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url,
  });
  return await result.json();
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };

