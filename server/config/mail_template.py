
def activate(url:str):
    return """
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Please activate your account</title>
            <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        """ + f"""
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
            <table role="presentation"
                style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                <tbody>
                    <tr>
                        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                            <table role="presentation"
                                style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                <tbody>
                                    <tr>
                                        <td style="padding: 40px 0px 0px;">
                                            <div style="text-align: left;">
                                                <div style="padding-bottom: 20px;"><img src="https://drive.google.com/uc?export=view&id=1WRjjjIkekybtxmby1V6XCMr-se59hQu-"
                                                        alt="Company" style="width: 56px;"></div>
                                            </div>
                                            <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                                <div style="color: rgb(0, 0, 0); text-align: left;">
                                                    <h1 style="margin: 1rem 0">Final step...</h1>
                                                    <p style="padding-bottom: 16px">Follow this link to verify your email
                                                        address.</p>
                                                    <p style="padding-bottom: 16px"><a href="{url}" target="_blank"
                                                            style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Confirm
                                                            now</a></p>
                                                    <p style="padding-bottom: 16px">If you did not ask to verify this address,
                                                        you can ignore this email.</p>
                                                    <p style="padding-bottom: 16px">Thank you,<br>The QuiZone Team</p>
                                                </div>
                                            </div>
                                            <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                                <p style="padding-bottom: 16px">Made with ♥ in India</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>

        </html>
    """


def resetPassword(url:str, name:str):
    return """
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password reset request</title>
            <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        """ + f"""
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
            <table role="presentation"
                style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                <tbody>
                    <tr>
                        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                            <table role="presentation"
                                style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                <tbody>
                                    <tr>
                                        <td style="padding: 40px 0px 0px;">
                                            <div style="text-align: left;">
                                                <div style="padding-bottom: 20px;"><img src="https://drive.google.com/uc?export=view&id=1WRjjjIkekybtxmby1V6XCMr-se59hQu-"
                                                        alt="Company" style="width: 56px;"></div>
                                            </div>
                                            <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                                <div style="color: rgb(0, 0, 0); text-align: left;">
                                                    <h1 style="margin: 1rem 0">Hello {name},</h1>
                                                    <p style="padding-bottom: 16px"><strong>A request has been received to change the password for your QuiZone account.</strong></p>
                                                    <p style="padding-bottom: 16px"><a href="{url}" target="_blank"
                                                            style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Reset Password</a></p>
                                                    <p style="padding-bottom: 16px">If you did not initiate the request, please contact us immediately at<a href = "mailto:quizoneinc@gmail.com"> quizoneinc@gmail.com</a></p>
                                                    <p style="padding-bottom: 16px">Thank you,<br>The QuiZone Team</p>
                                                </div>
                                            </div>
                                            <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                                <p style="padding-bottom: 16px">Made with ♥ in India</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>

        </html>
    """