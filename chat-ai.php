<?php
/*
Plugin Name: Chat IA
Plugin URI: https://github.com/FranklinStuar/chat-plugin-ai.git
Description: Chat using IA for your company
Version: 1.0.2
Author: Franklin Peñafiel
Author URI: https://franklindev.top/
License: Attribution-NonCommercial-NoDerivatives (BY-NC-ND)
License URI: https://creativecommons.org/licenses/by-nc-nd/4.0/
*/


// code for admin panel
include( plugin_dir_path( __FILE__ ) . 'admin.php' );

//code for frontend when You can connect the chatbot php with the react.js project
include( plugin_dir_path( __FILE__ ) . 'frontend.php' );

