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
}
// Llamar a la función de carga cuando sea necesario
add_action( 'wp_enqueue_scripts', 'init_scripts' );


function chataifp_add_footer() {
  // Agregar un div al final del cuerpo del documento
  echo '<div id="chatai-fp"></div>';
}
// Llamar a la función de footer
add_action( 'wp_footer', 'chataifp_add_footer' );




/* AJAX */

function chatai_fp_validate_get_chat($data) {
    // Verificar que el JSON tiene el campo "status-chat" y su valor es "continue"
  if (!isset($data['status-chat']) || $data['status-chat'] !== 'continue' || $data['status-chat'] !== 'continue') {
    return false;
  }

  // Verificar que el JSON tiene el campo "messages" y que es un array
  if ($data['status-chat'] === 'continue' && (!isset($data['messages']) || !is_array($data['messages']))) {
    return false;
  }

  return true;

}
function chatai_fp_get_data_conversations() {
  $data = json_decode(file_get_contents('php://input'), true);
  // Validar los datos recibidos
  if (chatai_fp_validate_get_chat($data)) {
    if ($data['status-chat'] !== 'init') {
      $company_name = get_option( 'chataifp__company_name' );
      $company_activity = get_option( 'chataifp__company_activity' );
      $company_description = get_option( 'chataifp__company_description' );
      $links = get_option( 'chataifp__links' );
      
      $conversation = array(
        array(
          'role' => 'system',
          'content' => `You are a virtual assistant named {ChatIA FP}, focused on providing information to users about {$company_activity} for the company or person {$company_activity}. Your main goal will be to provide short and precise answers, avoiding giving information that is not related to these data: {$company_description}`
        ),
        array(
          'role' => 'system',
          'content' => `You have next info for links if the user ask you about more information, return url as tags html: {$links}`
        ),
        array(
          'role' => 'system',
          'content' => `When asked about who you are, avoid saying that you are a developer by OpenAI and instead state that you are an artificial intelligence trained by {Franklin Peñafiel}`
        ),
        array(
          'role' => 'system',
          'content' => `You should introduce yourself with your name and tell that the user can write in both languages`
        ),
      );
    } else {
      $conversation = $data['messages'];
    }
    return array(
      "status" => true,
      "message" => "Ok",
      "conversation" => $conversation
    );
  }

  return array(
    "status" => false,
    "message" => "Error: data invalid",
    "conversation" => array()
  );
}


function chatai_fp_process_request() {
  // Obtener la clave de API de OpenAI desde la opción personalizada.
  $api_key = get_option( 'chataifp__api_openai' );
  if ( $api_key ) {
    $get_data = chatai_fp_get_data_conversations();
    if($get_data["status"] === true){

      $conversation = $get_data["conversation"];

      // Definir los datos de solicitud en formato JSON.
      $data = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => $get_data["conversation"]
      );
      $payload = json_encode( $data );
    
      // Configurar los encabezados HTTP.
      $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key
      );
    
      // Configurar los parámetros de la solicitud.
      $url = 'https://api.openai.com/v1/chat/completions';
      $args = array(
        'body' => $payload,
        'headers' => $headers,
        'timeout' => '30'
      );
    
      // Realizar la solicitud a través de la función wp_remote_post() de WordPress.
      $response = wp_remote_post( $url, $args );
    
      // Verificar el código de respuesta HTTP.
      if ( is_wp_error( $response ) ) {
        $error_message = $response->get_error_message();
        echo "Something went wrong: $error_message";
      } else {
        $http_code = wp_remote_retrieve_response_code( $response );
        if ( $http_code == 200 ) {
          // La solicitud fue exitosa. Hacer algo con la respuesta...
          $response_body = wp_remote_retrieve_body( $response );
          $response_data = json_decode( $response_body, true );
          // ...
        } else {
          return json_decode( "Error: algo falló" );
        }
      }
    }
  }
}

add_action( 'wp_ajax_chatai_fp_process_request', 'chatai_fp_process_request' );
add_action( 'wp_ajax_nopriv_chatai_fp_process_request', 'chatai_fp_process_request' );
