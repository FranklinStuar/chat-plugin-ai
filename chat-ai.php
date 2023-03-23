<?php
/*
Plugin Name: Chat IA
Plugin URI: https://github.com/FranklinStuar/chat-plugin-ai.git
Description: Chat using IA for your company
Version: 1.0.0
Author: Franklin Peñafiel
Author URI: https://franklindev.top/
License: Attribution-NonCommercial-NoDerivatives (BY-NC-ND)
License URI: https://creativecommons.org/licenses/by-nc-nd/4.0/
*/

include plugin_dir_path( __FILE__ ) . 'admin.php';

function chataifp__get_data_chat() {
  global $wpdb;
  $companyName = get_option( 'chataifp__company_name' );
  $companyActivity = get_option( 'chataifp__company_activity' );
  $companyDescription = get_option( 'chataifp__company_description' );
  $links = get_option( 'chataifp__links', array() );
  // Validar los datos obtenidos si es necesario
  // ...

  // Enviar los datos a la página de React
  wp_enqueue_script( 'nombre_de_tu_script_de_react' );
  wp_localize_script( 'nombre_de_tu_script_de_react', 'datos_desde_php', $opciones );
}

add_action( 'admin_enqueue_scripts', 'chataifp__get_data_chat' );
