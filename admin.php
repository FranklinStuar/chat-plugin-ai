<?php 
// Add a new menu item to the admin dashboard
function chataifp__add_admin_menu() {
  add_menu_page(
      'ChatAI Settings',
      'ChatAI',
      'manage_options',
      'chataifp__settings',
      'chataifp__settings_page'
  );
}
add_action( 'admin_menu', 'chataifp__add_admin_menu' );



function chataifp__settings_page() {
    ?>
<div class="wrap">
  <h2>ChatAI Settings</h2>
  <form method="post" accept-charset="utf-8">
    <?php settings_fields( 'chat_ai_settings_group' ); ?>
    <?php do_settings_sections( 'chataifp__settings' ); ?>
    <table class="form-table">
      <tr valign="top">
        <th scope="row">API OpenAI</th>
        <td><input style="width:100%" type="text" name="chataifp__api_openai"
            value="<?php echo esc_attr( get_option( 'chataifp__api_openai' ) ); ?>"></td>
      </tr>
      <tr valign="top">
        <th scope="row">Name of Company</th>
        <td><input style="width:100%" type="text" name="chataifp__company_name"
            value="<?php echo esc_attr( get_option( 'chataifp__company_name' ) ); ?>"></td>
      </tr>
      <tr valign="top">
        <th scope="row">Activity of Company</th>
        <td><input style="width:100%" type="text" name="chataifp__company_activity"
            value="<?php echo esc_attr( get_option( 'chataifp__company_activity' ) ); ?>"></td>
      </tr>
      <tr>
        <th scope="row">Description of Company</th>
        <td><textarea name="chataifp__company_description"
            style="width:100%; min-height:120px"><?php echo esc_html( get_option( 'chataifp__company_description' ) ); ?></textarea>
        </td>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <?php
                $links = get_option( 'chataifp__links', array() );
                if ( ! empty( $links ) ):
                  foreach ( $links as $link ):
              ?>
                  <tr>
                    <td><input type="text" name="chataifp__links_name[]" value="<?php echo esc_attr( $link['name'] ); ?>">
                    </td>
                    <td><input type="text" name="chataifp__links_url[]" value="<?php echo esc_attr( $link['url'] ); ?>">
                    </td>
                    <td><input type="text" name="chataifp__links_description[]"
                        value="<?php echo esc_attr( $link['description'] ); ?>"></td>
                  <td><button type="button" class="remove-link button">Remove Link</button></td>
                  </tr>
              <?php
                  endforeach;
                else:
              ?>
                <tr>
                  <td><input type="text" name="chataifp__links_name[]"></td>
                  <td><input type="text" name="chataifp__links_url[]"></td>
                  <td><input type="text" name="chataifp__links_description[]"></td>
                </tr>
              <?php
                endif
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
  /**
   * Add and remove links used. Those are used as reference to pages with more information
   */
  jQuery(document).ready(function ($) {
    $('.add-link').click(function () {
      var linkRow =
        '<tr><td><input type="text" name="chataifp__links_name[]"></td><td><input type="text" name="chataifp__links_url[]"></td><td><input type="text" name="chataifp__links_description[]"></td><td><button type="button" class="remove-link button">Remove Link</button></td></tr>';
      $('.links-table tbody').append(linkRow);
    });

    $(document).on('click', '.remove-link', function () {
      $(this).closest('tr').remove();
    });
  });
</script>
<?php
  }
  
  
  // Save the plugin settings
  function chataifp__save_settings() {
      // Debugging code to print out posted values
      if ( isset( $_POST['chataifp__api_openai'] ) ) {
          update_option( 'chataifp__api_openai', sanitize_text_field( $_POST['chataifp__api_openai'] ) );
      }
      if ( isset( $_POST['chataifp__company_name'] ) ) {
          update_option( 'chataifp__company_name', sanitize_text_field( $_POST['chataifp__company_name'] ) );
      }
      if ( isset( $_POST['chataifp__company_activity'] ) ) {
          update_option( 'chataifp__company_activity', sanitize_text_field( $_POST['chataifp__company_activity'] ) );
      }
      if ( isset( $_POST['chataifp__company_description'] ) ) {
          update_option( 'chataifp__company_description', sanitize_text_field( $_POST['chataifp__company_description'] ) );
      }
      // save links as just only one data in the database
      if ( !empty( $_POST['chataifp__links_name'] ) ) {
        $link_names = $_POST['chataifp__links_name'];
          $link_urls = $_POST['chataifp__links_url'];
          $link_descriptions = $_POST['chataifp__links_description'];
          $links = array();
          for ( $i = 0; $i < count( $link_names ); $i++ ) {
              if ( ! empty( $link_names[ $i ] ) && ! empty( $link_urls[ $i ] ) && ! empty( $link_descriptions[ $i ] ) ) {
                  $links[] = array(
                      'name'        => sanitize_text_field( $link_names[ $i ] ),
                      'url'         => sanitize_text_field( $link_urls[ $i ] ),
                      'description' => sanitize_text_field( $link_descriptions[ $i ] ),
                  );
              }
          }
          update_option( 'chataifp__links', $links );
      }

  }
  add_action( 'admin_init', 'chataifp__save_settings' );


// Register the settings page and options
function chataifp__register_settings() {
    register_setting( 'chat_ai_settings_group', 'chataifp__api_openai' );
    register_setting( 'chat_ai_settings_group', 'chataifp__company_name' );
    register_setting( 'chat_ai_settings_group', 'chataifp__company_activity' );
    register_setting( 'chat_ai_settings_group', 'chataifp__company_description' );
    register_setting( 'chat_ai_settings_group', 'chataifp__links' );
}
add_action( 'admin_init', 'chataifp__register_settings' );


// Register the deactivation hook
register_deactivation_hook( __FILE__, 'chataifp__deactivation' );

// Define the deactivation callback function
function chataifp__deactivation() {
    // Delete the plugin's options from the database
    delete_option( 'chataifp__api_openai' );
    delete_option( 'chataifp__company_name' );
    delete_option( 'chataifp__company_activity' );
    delete_option( 'chataifp__company_description' );
    delete_option( 'chataifp__links' );
}