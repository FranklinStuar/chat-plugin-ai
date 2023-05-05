<?php


function init_scripts() {
  // Obtener la ruta base de tu plugin
  $plugin_url_react = plugin_dir_url( __FILE__ )."/dist/";

  // Leer el contenido del archivo asset-manifest.json
  $asset_manifest = file_get_contents(__DIR__ . '/dist/asset-manifest.json');

  // Decodificar el contenido JSON en un objeto PHP
  $asset_manifest_obj = json_decode($asset_manifest);
  $main_css = $asset_manifest_obj->files->{'main.css'};
  $main_js = $asset_manifest_obj->files->{'main.js'};

  // Agregar el archivo CSS
  wp_enqueue_style( 'frontend-css', $plugin_url_react . $main_css );
  // Agregar el archivo JS
  wp_enqueue_script( 'frontend-js', $plugin_url_react . $main_js, array(), null, true );

  // habilito la opción para ajax
  wp_localize_script( 'custom', 'chatai_fp', array(
    'api_url' => admin_url( 'wp-json/chatai-fp/v1' ),
    'ajaxurl' => admin_url('admin-ajax.php')
  ) );
}
// Llamar a la función de carga cuando sea necesario
add_action( 'wp_enqueue_scripts', 'init_scripts' );


function chataifp_add_footer() {
  // Agregar un div al final del cuerpo del documento
  echo '<div id="chatai-fp"></div>';
}
// Llamar a la función de footer
add_action( 'wp_footer', 'chataifp_add_footer' );




// valid if the content send from ajax is valid
function chatai_fp_validate_get_chat($data) {
    // Verify that the JSON has the field "status-chat" and its value is "continue"
  if (!(isset($data['status-chat']) && ($data['status-chat'] === 'continue' || $data['status-chat'] === 'init'))) {
    return false;
  }

  // Verify that the JSON has the field "messages" and that it is an array
  if ($data['status-chat'] === 'continue' && (!isset($data['messages']) || !is_array($data['messages']))) {
    return false;
  }

  return true;
}

/**
 * Load content from ajax and it checks if is the first message or is continuation of the conversation
 */
function chatai_fp_get_data_conversations() {
  //valid data
  $data = json_decode(file_get_contents('php://input'), true);
  if(!$data){
    return array(
      "status" => false,
      "message" => "Error: data invalid from frontend",
      "conversation" => array()
    );
  }
  // if data is correct, get the content of the messages
  $data = $data["data"];

  // valir if is first message o conversation's continuation 
  if ($data && chatai_fp_validate_get_chat($data)) {

    // if the conversation continue, just only return the messages from ajax
    $conversation = $data['messages'];

    //if init will config the chat with the info of the company and all content save from admin panel
    if ($data['status-chat'] === 'init') {
      $company_name = get_option( 'chataifp__company_name' );
      $company_activity = get_option( 'chataifp__company_activity' );
      $company_description = get_option( 'chataifp__company_description' );
      $links = get_option( 'chataifp__links' );
      
      // content to tran the plugin. Here you can add all content you want it say to your users and you can add all restrictions you need
      $conversation = array(
        array(
          'role' => 'system',
          'content' => "You are a virtual assistant named 'ChatIA FP', focused on providing information to users about `". $company_activity . "` for the company or person `" . $company_name . "` Your main goal will be to provide short and precise answers, avoiding giving information that is not related to these data: " . $company_description
        ),
        array(
          'role' => 'system',
          'content' => "Next links in json have access about the company, you will return links if user need this info. All links will return in plaintext: `" . json_encode($links) . "`"
        ),
        array(
          'role' => 'system',
          'content' => "When asked about who you are, avoid saying that you are a developer by OpenAI and instead state that you are an artificial intelligence trained by 'Franklin Peñafiel'"
        ),
        array(
          'role' => 'system',
          'content' => "You don't say content different the company. Your propose is to sell the company products ad its brand. If the use question you about recommendations, your should include to the company in the list of recommendations"
        ),
        array(
          'role' => 'system',
          'content' => "You should introduce yourself with your name and tell that the user can write in both languages, don't say who is your trainer in your first message"
        ),
      );
    } 
    return array(
      "status" => true,
      "message" => $data['status-chat'],
      "conversation" => $conversation
    );
  }

  return array(
    "status" => false,
    "message" => "Error: data invalid",
    "conversation" => array()
  );
}

/**
 * OpenAI request for chatbot
 * 
 * this function will connect with openAI and will return all content
 */
function chatai_fp_chat_request($api_key,$messages) {
    $url = 'https://api.openai.com/v1/chat/completions';
    $data = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => $messages
    );
    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n" .
                        "Authorization: Bearer " . $api_key . "\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ),
    );

    $context  = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    $result = json_decode($response, true);

    // imprime el resultado obtenido de la API
    return $result;

}



function chatai_fp_process_request($intent = 0) {
  // get OpenAI key from admin panel (database) 
  $api_key = get_option( 'chataifp__api_openai' );
  
  if ( $api_key ) {
    $get_data = chatai_fp_get_data_conversations(); // valid if data is correct

    if($get_data["status"] === true){
      // request with openAI
      $responseOpenAI = chatai_fp_chat_request($api_key,$get_data["conversation"]);
      if(!$responseOpenAI && $intent < 3)
        chatai_fp_process_request($intent+1);
      elseif(!$responseOpenAI && $intent >= 3)
        wp_send_json_error( $get_data, 500 );

      // add data to data from ajax
      if(isset($responseOpenAI["choices"])){
        if($get_data["message"]){
          $messages = $get_data["conversation"];
          $response_message = $responseOpenAI["choices"][0]["message"];
          // echo $response_message;
          $response_message["content"] = preg_replace('/\b((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i', '<a href="$1" target="_blank">$1</a>', $response_message["content"]);

          $messages[] = $response_message;
          wp_send_json($messages);
        }
        else
          wp_send_json( $responseOpenAI["choices"][0]["message"] ) ;
          
      }
      else{
        $messages = json_decode($get_data["conversation"]);
        if($messages){
          $messagesError = array_pop($messages);
          array_push($messagesError, array(
            "role" => "error",
            "content" => "There was an error in my connection with the server. Please repeat me your question"
          ));
          wp_send_json($messagesError);
        }
        wp_send_json(["status"=>'error_desconocido', 'responseOpenAI'=>$responseOpenAI]);
      }
    }
  }
}

// the plugin will connect by api rest because react project doesn't allow use ajax. 
add_action( 'rest_api_init', function () {
  register_rest_route( 
    'chatai-fp/v1', // url registred on scripts
    '/conversation', 
      array(
        'methods' => 'POST',
        'callback' => 'chatai_fp_process_request',
      ) 
    );
});
