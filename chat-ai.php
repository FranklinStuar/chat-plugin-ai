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

// Add a new menu item to the admin dashboard
function chataifp__add_admin_menu() {
  add_menu_page(
      'My Plugin Settings',
      'My Plugin',
      'manage_options',
      'chataifp_-settings',
      'chataifp__settings_page'
  );
}
add_action( 'admin_menu', 'chataifp__add_admin_menu' );



function chataifp__settings_page() {
  ?>
  <div class="wrap">
      <h2>My Plugin Settings</h2>
      <form method="post" action="options.php">
          <?php settings_fields( 'chataifp__settings_group' ); ?>
          <?php do_settings_sections( 'chataifp_-settings' ); ?>
          <table class="form-table">
              <tr valign="top">
                  <th scope="row">Name of Company</th>
                  <td><input type="text" name="chataifp__company_name" value="<?php echo esc_attr( get_option( 'chataifp__company_name' ) ); ?>"></td>
              </tr>
              <tr valign="top">
                  <th scope="row">Activity of Company</th>
                  <td><input type="text" name="chataifp__company_activity" value="<?php echo esc_attr( get_option( 'chataifp__company_activity' ) ); ?>"></td>
              </tr>
              <tr valign="top">
                  <th scope="row">Description of Company</th>
                  <td><textarea name="chataifp__company_description"><?php echo esc_html( get_option( 'chataifp__company_description' ) ); ?></textarea></td>
              </tr>
              <tr valign="top">
                  <th scope="row">Links</th>
                  <td>
                      <table class="links-table">
                          <thead>
                              <tr>
                                  <th>Name Page</th>
                                  <th>URL</th>
                                  <th>Description</th>
                              </tr>
                          </thead>
                          <tbody>
                              <?php
                              $links = get_option( 'chataifp__links', array() );
                              if ( ! empty( $links ) ) {
                                  foreach ( $links as $link ) {
                                      ?>
                                      <tr>
                                          <td><input type="text" name="chataifp__links_name[]" value="<?php echo esc_attr( $link['name'] ); ?>"></td>
                                          <td><input type="text" name="chataifp__links_url[]" value="<?php echo esc_attr( $link['url'] ); ?>"></td>
                                          <td><input type="text" name="chataifp__links_description[]" value="<?php echo esc_attr( $link['description'] ); ?>"></td>
                                      </tr>
                                      <?php
                                  }
                              } else {
                                  ?>
                                  <tr>
                                      <td><input type="text" name="chataifp__links_name[]"></td>
                                      <td><input type="text" name="chataifp__links_url[]"></td>
                                      <td><input type="text" name="chataifp__links_description[]"></td>
                                  </tr>
                                  <?php
                              }
                              ?>
                          </tbody>
                      </table>
                      <button type="button" class="add-link button">Add Link</button>
                  </td>
              </tr>
          </table>
          <?php submit_button(); ?>
      </form>
  </div>
  <script>
      jQuery(document).ready(function($) {
          $('.add-link').click(function() {
              var linkRow = '<tr><td><input type="text" name="chataifp__links_name[]"></td><td><input type="text" name="chataifp__links_url[]"></td><td><input type="text" name="chataifp__links_description[]"></td></tr>';
              $('.links-table tbody').append(linkRow);
          });
      });
  </script>
  <?php
}


// Register the plugin settings
function chataifp__register_settings() {
  register_setting( 'chataifp__settings_group', 'chataifp__option1' );
  register_setting( 'chataifp__settings_group', 'chataifp__option2' );
}
add_action( 'admin_init', 'chataifp__register_settings' );

// Save the plugin settings
function chataifp__save_settings() {
  if ( isset( $_POST['chataifp__company_name'] ) ) {
      update_option( 'chataifp__company_name', sanitize_text_field( $_POST['chataifp__company_name'] ) );
  }
  if ( isset( $_POST['chataifp__company_activity'] ) ) {
      update_option( 'chataifp__company_activity', sanitize_text_field( $_POST['chataifp__company_activity'] ) );
  }
  if ( isset( $_POST['chataifp__company_description'] ) ) {
      update_option( 'chataifp__company_description', sanitize_text_field( $_POST['chataifp__company_description'] ) );
  }
  if ( isset( $_POST['chataifp__links'] ) ) {
      update_option( 'chataifp__links', sanitize_text_field( $_POST['chataifp__links'] ) );
  }
}
add_action( 'admin_post_save_chataifp__settings', 'chataifp__save_settings' );


// Register the deactivation hook
register_deactivation_hook( __FILE__, 'chataifp__deactivation' );

// Define the deactivation callback function
function chataifp__deactivation() {
    // Delete the plugin's options from the database
    delete_option( 'chataifp__company_name' );
    delete_option( 'chataifp__company_activity' );
    delete_option( 'chataifp__company_description' );
    delete_option( 'chataifp__links' );
}