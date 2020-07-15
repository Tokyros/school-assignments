<?php
    function http($url, $method, $data = array(), $cookies = array()) {
        $options = array(
            'http' => array(
                'method' => $method,
            )
        );
        if (count($data)) {
            $options['http']['content'] = http_build_query($data);
        }
        if (count($cookies)) {
            $cookie_string = "Cookie: ";
            foreach ($cookies as $name => $value) {
                $cookie_string = $cookie_string . $name . "=" . $value . ";";
            }
            $options['http']['header'] = $cookie_string;
        }
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        $cookies = array();

        foreach ($http_response_header as $hdr) {
            if (preg_match('/^Set-Cookie:\s*([^;]+)/', $hdr, $matches)) {
                parse_str($matches[1], $tmp);
                $cookies += $tmp;
            }
        }

        return array('result' => $result, 'cookies' => $cookies);
    }
?>