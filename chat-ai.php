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

