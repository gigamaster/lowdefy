/*
  Copyright 2020 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import schema from './GoogleSheetGetManySchema.json';
import cleanRows from '../cleanRows';
import getSheet from '../getSheet';
import { transformRead } from '../transformTypes';
import mingoAggregation from '../../../utils/mingoAggregation';
import mingoFilter from '../../../utils/mingoFilter';

async function googleSheetGetMany({ request, connection }) {
  const { filter, limit, offset, pipeline } = request;
  const sheet = await getSheet({ connection });
  let rows = await sheet.getRows({ limit, offset });
  rows = cleanRows(rows);
  rows = transformRead({ input: rows, types: connection.columnTypes });
  if (filter) {
    rows = mingoFilter({ input: rows, filter });
  }
  if (pipeline) {
    rows = mingoAggregation({ input: rows, pipeline });
  }
  return rows;
}

export default { resolver: googleSheetGetMany, schema, checkRead: true, checkWrite: false };
