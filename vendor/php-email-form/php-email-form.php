
<?php
/**
 * PHP Email Form Library
 * This class helps send contact messages via PHP.
 * Note: This is a simplified version of the PHP Email Form.
 */

class PHP_Email_Form {
  public $to = '';
  public $from_name = '';
  public $from_email = '';
  public $subject = '';
  public $ajax = false;
  private $messages = array();

  public function add_message($content, $label = '', $priority = 0) {
    $this->messages[] = array('label' => $label, 'content' => $content, 'priority' => $priority);
  }

  public function send() {
    if (!$this->to || !$this->from_email || !$this->subject) {
      return 'Missing required fields';
    }

    $headers = "From: {$this->from_name} <{$this->from_email}>
";
    $headers .= "Reply-To: {$this->from_email}
";
    $headers .= "Content-Type: text/plain; charset=UTF-8
";

    $message = "";
    foreach ($this->messages as $msg) {
      $message .= ($msg['label'] ? $msg['label'] . ": " : "") . $msg['content'] . "
";
    }

    if (mail($this->to, $this->subject, $message, $headers)) {
      return 'OK';
    } else {
      return 'Email sending failed';
    }
  }
}
?>
