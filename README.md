# Global Input Software
Global Input is the first commercial-grade, open-source software packages for enabling applications running on multiple devices to exchange information securely.

Please visit

     https://globalinput.co.uk
for more information.

In order to make an React.js application powered by the Global Input:

   npm install --save global-input-react

Simplest way is to follow the example in

   https://globalinput.co.uk

If you are familiar with React.js, you will find only two part are related to this package:

 (1) Returning a metadata in the buildInitData() method. Which contains the fields that are to be displayed in the mobile app. When the user begins to operate on the fields (text fields, buttons, ranges, selection etc), the corresponding function will be called specified in the onInput attribute of the metadata.

(2) One line of code where the QR code should be displayed.

As simple as that, your application will be powerred by the Global Input.







## License

    /*
     * Copyright 2017 Dr. Dilshat Hewzulla (hewzulla@gmail.com)
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
