<?php
session_start();
require_once('class.phpmailer.php');
if($_POST) {
    if( !isset($_SESSION['sended']) ) {
        
        
        if( isset( $_POST['contactname'] ) && !empty( $_POST['contactname'] ) ):
            $name = filter_var(trim($_POST['contactname']), FILTER_SANITIZE_STRING);
        else:
          echo $error = 'Name is empty!';
           return;
        endif;
        
        if( isset( $_POST['contactemail'] ) && !empty( $_POST['contactemail'] ) ):
            $email = filter_var(trim($_POST['contactemail']), FILTER_SANITIZE_EMAIL);
                if( !filter_var( $email , FILTER_VALIDATE_EMAIL ) ):
                   echo $error = 'Email is not valid!';
                    return;
                endif;
        else:
            echo $error = 'Email is empty!';
          return;
        endif;
        
       if( isset( $_POST['contactsubject'] ) && !empty( $_POST['contactsubject'] ) ):
            $subject = filter_var(trim($_POST['contactsubject']), FILTER_SANITIZE_STRING);
        else:
         echo  $error = 'Subject is Empty!';
          return;
        endif;
        
        if( isset( $_POST['contactmessage'] ) && !empty( $_POST['contactmessage'] ) ):
             $message = filter_var(trim($_POST['contactmessage']), FILTER_SANITIZE_STRING);
        else:
          echo  $error = 'Message is empty!';
            return;
        endif;
        
            if(!isset($error)) {
    
            // if we have no validation errors prepare mail
                $mail             = new PHPMailer(); // defaults to using php "mail()"
        
                $body             = $message;
        
                $mail->AddReplyTo($email,$name);
        
                
                // change this mail address with yours
                $address = "puffde@gmail.com"; // YOUR EMAIL ADDRESS
                $mail->From = $email;  
                $mail->FromName = $name;  
                $mail->AddAddress($address, "Eony"); 
                $mail->Subject    = $subject;
                $mail->AltBody    = "Sent from Geass!";
                $mail->MsgHTML($body);
        
                if($mail->Send()):
                    echo 'success';
                    $_SESSION['sended'] = 'sended';
                else :
                    echo 'error';
                endif;
        
            
        }
    } else {
        echo 'already';
    }
}


?>